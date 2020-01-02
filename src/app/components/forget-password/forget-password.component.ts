import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Account } from '../../services/account/account.service';
import { Http } from '../../services/http/http.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  public loading: Boolean = false;

  public email: string = '';
  public password: string = '';
  public trypassword: string = '';

  constructor(private snackbar: MatSnackBar, private account: Account, private http: Http, private router: Router) { }

  ngOnInit() {
    if(this.account.login == true)  this.router.navigate(['/tickets']);
  }

  submit(){
    let email = this.email,
      password = this.password,
      trypassword = this.trypassword;

    if(!email || email.length == 0){
      this.snackbar.open('آدرس ایمیل را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    } else if(!password || password.length == 0){
      this.snackbar.open('رمز عبور جدید را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    } else if(!trypassword || trypassword.length == 0){
      this.snackbar.open('تکرار رمز عبور جدید را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    } else if(trypassword != password){
      this.snackbar.open('رمز عبور جدید با تکرار آن همخوانی ندارد.', 'باشه', { direction: 'rtl', duration: 4000 });
    } else {
      this.loading = true;
      this.http.request('main', `/account/forget`, 'POST', { email, password }, false)
      .then((res:any)=>{
        this.loading = false;
        this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
        if(res['status'] == true){
          this.router.navigate(['/account/login']);
        }
      }).catch(()=>{
        this.loading = false;
        this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
      })
    }
  }
}
