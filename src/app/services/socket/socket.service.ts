import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import io from 'socket.io-client';
import { Account } from '../account/account.service';

let host = window.location.hostname;

const server = (host=='localhost' && window.localStorage.getItem('DEBUG') == 'true')?'http://127.0.0.1:2998':`https://api.ghoghnoos.co`;

@Injectable({
  providedIn: 'root'
})
export class Socket {

  public socket: any = null;
  constructor(private account: Account, private snackbar: MatSnackBar) { }
  
  connect(){
    return new Promise((resolve)=>{
      this.socket = io.connect(server);

      this.socket.on('connect', ()=>{        
        this.socket.emit('authenticate', { token: this.account.auth.access_token});
      });

      this.socket.on('authenticated', ()=> resolve());

      this.socket.on('disconnect', ()=>{
        this.snackbar.open('اتصال به سرور قطع شد.', 'باشه', { direction: 'rtl', duration: 5000 });
      });
    })
  }
}
