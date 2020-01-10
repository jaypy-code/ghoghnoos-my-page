import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Account } from '../../services/account/account.service';
import { Socket } from '../../services/socket/socket.service';

let peerConnectionConfig = {
  'iceServers': [
    {'urls': 'stun:stun.stunprotocol.org:3478'},
    {'urls': 'stun:stun.l.google.com:19302'},
  ]
};
let peerConnection;
let audio = new Audio(),
  music = new Audio('/assets/calling.mp3');

audio.autoplay = true;

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.css']
})
export class CallComponent implements OnInit, OnDestroy {

  public loading: boolean = false;
  public calling: boolean = false;
  public allowd: boolean = true;
  public answering: boolean = false;
  private sdp: any = null;
  private stream: any = null;
  private id: string  = null;
  constructor(public account: Account, private socket: Socket, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.getPermission()
    .then(()=>{      
      peerConnection = new RTCPeerConnection(peerConnectionConfig);
      peerConnection.ontrack = this.onGetStream;
      peerConnection.addStream(this.stream);
      this.eventHandler();
    })
  }

  ngOnDestroy(){
    this.kill();
    
  }

  eventHandler(){
    this.socket.socket.on('disconnect', ()=>{
      this.kill();
    });

    this.socket.socket.on('on-new-call', data=>{
      this.id = data['id'];
      peerConnection.setRemoteDescription(new RTCSessionDescription(data['sdp']))
      .then(function() {
          return peerConnection.createAnswer()
      }).then(data=> this.getAnswerSDP(data));
    });
    this.socket.socket.on('on-join-anwer', data=>{
      music.pause();
      this.answering = true;
      peerConnection.setRemoteDescription(new RTCSessionDescription(data));
    });
  }

  getPermission(){
    return new Promise((resolve, reject)=>{
      if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream=>{
          this.allowd = true;
          this.stream = stream;
          resolve();
        })
        .catch(()=>{
          this.allowd = false;
          this.snackbar.open('خطا در دریافت دسترسی', 'باشه', { direction: 'rtl', duration: 4000 });
          reject();
        });
      } else {
        this.allowd = false;
        reject();
      }
    })
  }

  getCallSDP(){
    return new Promise((resolve, reject)=>{
      peerConnection.createOffer()
      .then(description=>{
        return peerConnection.setLocalDescription(description);
      })
      .then(()=>{
        this.sdp = peerConnection.localDescription;
        resolve();
      })
      .catch(reject);
    })
  }

  getAnswerSDP(description){
    peerConnection.setLocalDescription(description).then(()=> {
      this.sdp = peerConnection.localDescription;
      this.socket.socket.emit('join-call', { id: this.id, sdp: peerConnection.localDescription });
      document.getElementById('header').style.display = 'none';
      this.answering = true;
    });
  }

  async create(){
    try {
      await this.getCallSDP();
      this.calling = true;
      document.getElementById('header').style.display = 'none';
      this.socket.socket.emit('new-call', { sdp: this.sdp });
      this.soundCall();
    } catch (error) {
      
    }
  }

  kill(){
    this.loading = false;
    this.calling = false;
    this.answering = false;
    this.allowd = true;
    this.sdp = null;
    audio.pause();
    music.pause();
    document.getElementById('header').style.display = 'block';        
    if(this.stream){
      this.stream.getTracks().forEach(track=> {
        track.stop();
      });
      this.stream = null;
    }
  }

  onGetStream(event){
    audio.srcObject = event.streams[0];
  }

  soundCall(){
    music.pause();
    music = new Audio('/assets/calling.mp3');
    music.play();
    music.loop = true;
  }
}
