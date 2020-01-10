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

let sdp = null,
  ice = null;

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
  private stream: any = null;
  private id: string  = null;
  constructor(public account: Account, private socket: Socket, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.getPermission()
    .then(()=>{      
      peerConnection = new RTCPeerConnection(peerConnectionConfig);
      peerConnection.ontrack = this.onGetStream;
      peerConnection.onicecandidate = this.createICE;
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
      this.answer(data, true);      
    });
    this.socket.socket.on('on-join-anwer', data=>{            
      music.pause();
      this.answer(data, false);
    });

    this.socket.socket.on('on-join-call', console.log);
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

  createICE(event){
    if(event.candidate != null) {
      ice = event.candidate;
    }
  }

  async createSDP(description){
    await peerConnection.setLocalDescription(description);
    sdp = peerConnection.localDescription;
  }
  
  kill(){
    this.loading = false;
    this.calling = false;
    this.answering = false;
    this.allowd = true;
    sdp = null;
    ice = null;
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

  answer(signal={ id: '', ice, sdp }, answer=true){
    this.answering = true;
    if(answer == false){ // User
      peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
      peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice))
    } else { // Admin
      document.getElementById('header').style.display = 'none';        
      peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
      .then(()=>
         peerConnection.createAnswer()
      )
      .then(this.createSDP)
      .then(()=>
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice))
      )
      .then(()=>{
        setTimeout(() => {        
          this.socket.socket.emit('join-call', { id: signal.id, ice, sdp });
        }, 3000);
      })
      .catch(console.log);
    }
  }

  create(){
    this.calling = true;
    this.soundCall();
    document.getElementById('header').style.display = 'none';        
    peerConnection.createOffer().then(this.createSDP);
    setTimeout(() => {
      this.socket.socket.emit('new-call', { ice, sdp });
    }, 3000);
  }

  soundCall(){
    music.pause();
    music = new Audio('/assets/calling.mp3');
    music.play();
    music.loop = true;
  }
}
