import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from './services/account/account.service';
import { Http } from './services/http/http.service';
import { Socket } from './services/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public splash: Boolean = true;
  public show: Boolean = false;
  public open: boolean = true;
  public path: string = '';
  constructor(public account: Account, private http: Http, private socket: Socket, private router: Router) {}
  ngOnInit() {
    this.doShow();
    this.path = window.location.pathname;
    this.router.events.subscribe(()=> { 
      this.doShow();
      this.path = window.location.pathname;      
    });

    this.account.load()
    .then(async ()=>{
      if(this.account.login == true){
        try {
          this.socket.connect();
          let res = await this.http.request('main', '/account/me', 'GET', {}, true);          
          if(res['status'] == true && res['data'] != null){            
            this.show = true;
            this.account.info = res['data'];
          } else {
            this.account.logout();
            this.router.navigate(['/account/login'])
          }
          this.splash = false;
        } catch (error) {
          this.account.logout();
          this.router.navigate(['/account/login'])
          this.splash = false;
        }
      } else {
        this.splash = false;
      }
    });
  }

  doShow(){
    let paths = ['/account/login', '/account/register', '/account/forget'];
    if(paths.includes(window.location.pathname) == true || this.account.login == false){
      this.show = false;
    } else {
      this.show = true;
    }
  }
}
