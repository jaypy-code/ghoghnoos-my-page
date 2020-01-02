import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { Socket } from '../../services/socket/socket.service';


@Component({
  selector: 'app-chat-to',
  templateUrl: './chat-to.component.html',
  styleUrls: ['./chat-to.component.css']
})
export class ChatToComponent implements OnInit {

  private id: string = '';
  public connecting: boolean = false;
  public messages: object[] = [];
  public message: string = '';

  constructor(private socket: Socket, private activatedRoute: ActivatedRoute, private router: Router, private buttonSheet: MatBottomSheet, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.connecting = true;
    this.activatedRoute.params.subscribe(param=>{
      this.id = param['id'];
      this.socket.socket.emit('get-message', this.id);
      this.eventsHandel();
    });
  }

  eventsHandel(socket=this.socket.socket){
    socket.on('on-room-message', data=>{
      data = JSON.parse(data);
      this.messages.push(data);
    });

    socket.on('on-closed-room', ()=>{
      this.router.navigate(['/chat']);
    });

    socket.on('on-get-message', (data:object[])=>{
      this.connecting = false;
      for(let i in data){
        setTimeout(() => {
          this.addMessage(data[i]);
        }, 3);
      }
    });
  }

  send(){        
    if(this.message.length == 0 || this.message == '' || this.message.trim().split('').length == 0) return;
    else {
      this.socket.socket.emit('room-message', { message: this.message, id: this.id });
      this.message = '';
    }
  }

  addMessage(data){
    this.messages.push(data);

    setTimeout(() => {
      let div = document.getElementById('messages');
      div.scrollTop = div.scrollHeight;
    }, 10);
  }

  when(at) {
    if(at == null) return "بدون زمان";
    let date = new Date(at);
    let now = new Date();

    if ((now.getFullYear() - date.getFullYear()) != 0) {
      return (now.getFullYear() - date.getFullYear()) + " سال پیش";
    } else if (((now.getMonth() + 1) - (date.getMonth() + 1)) != 0) {
      return ((now.getMonth() + 1) - (date.getMonth() + 1)) + " ماه پیش";
    } else if (((now.getDate() + 1) - (date.getDate() + 1)) != 0) {
      return (now.getDate() + 1) - (date.getDate() + 1) + " روز پیش";
    } else if ((now.getHours() - date.getHours()) != 0) {
      return (now.getHours() - date.getHours()) + " ساعت پیش";
    } else {
      return "چند لحظه پیش"
    }
  }

  close(){
    this.buttonSheet.open(ConfirmComponent, { data: { title: 'بستن گفتگو', text: 'با بستن این گفتگو تمامی پیام ها حذف می شوند؛ آیا شما مطمعن به بستن این گفتگو هستید ؟' } }).afterDismissed().subscribe(result=>{
      if(result == true){
        this.socket.socket.emit('close-room', this.id);
        this.router.navigate(['/chat']);
      }
    })
  }
}
