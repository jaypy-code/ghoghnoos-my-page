import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Account } from '../../services/account/account.service';
import { Http } from '../../services/http/http.service';
import { Socket } from '../../services/socket/socket.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  public loading: Boolean = false;

  public email: String = '';
  public password: String = '';
  public remember: boolean = false;
  public mode: string;
  constructor(private snackbar: MatSnackBar, private account: Account, private http: Http, private socket: Socket, private router: Router, private recaptchaV3Service: ReCaptchaV3Service) { }

  ngOnInit() {
    if(this.account.login == true)  this.router.navigate(['/tickets']);
    this.mode = (window.location.pathname == '/account/login')?'login':'register';
  }
  
  submit(){
    this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
      let email = this.email,
        password = this.password;

      if(!token) {
        this.snackbar.open('ریکپتاچا تایید نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
      } else if(!email || email.length == 0){
        this.snackbar.open('آدرس ایمیل را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
      } else if(!password || password.length == 0){
        this.snackbar.open('رمز عبور را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
      } else {
        this.loading = true;
        this.http.request('main', `/account/${this.mode}`, 'POST', { email, password }, false)
        .then((res:any)=>{
          this.loading = false;
          this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
          if(res['status'] == true){
            this.socket.connect();
            this.account.set(res['auth'], res['info'], this.remember).then(()=>{
              this.router.navigate(['/tickets']);
            })
          }
        }).catch(()=>{
          this.loading = false;
          this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
        })
      }
    })
  }
}
