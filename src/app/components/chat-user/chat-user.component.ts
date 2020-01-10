import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Account } from '../../services/account/account.service';
import { Socket } from '../../services/socket/socket.service';
import { Functions } from '../../services/functions/functions.service';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit {
  public loading: boolean = false;
  public joining: boolean = false;
  public data = [];
  public column: string[] = ['name', 'email', 'startedAt', 'join'];

  constructor(public account: Account, private socket: Socket, public functions: Functions, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    if(this.account.info.permission != 'user') {
      this.socket.socket.emit('get-room');
    } else {
      this.socket.socket.emit('room');
    }
    this.eventsHandel();
  }

  eventsHandel(socket=this.socket.socket){
    socket.on('on-new-room', data=>{
      data =JSON.parse(data);
      this.router.navigate([`/chat/${data['_id']}`]);
      this.snackbar.open(data['message'], 'باشه', { direction: 'rtl', duration: 4000 });
    });

    socket.on('on-room', data=>{
      this.loading = false;
      if(data != null) this.router.navigate([`/chat/${data}`]);
    });

    socket.on('on-get-room', data=>{
      this.loading = false;
      this.data = data;      
    });

    socket.on('on-join-room', result=>{
      this.joining = false;
      if(result != false) this.router.navigate([`/chat/${result}`]);
      else this.snackbar.open('شما اکنون نمی توانید جوابگو باشید.', 'باشه', { direction: 'rtl', duration: 5000 });
    });
  }

  create(){
    this.loading = true;
    this.socket.socket.emit('new-room');
  }
  
  join(id=''){
    this.joining = true;
    this.socket.socket.emit('join-room', id);
  }
}
