import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Account } from '../../services/account/account.service';
import { Http } from '../../services/http/http.service';
import { VerifyPhoneComponent } from '../../dialogs/verify-phone/verify-phone.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public index: number = 1;
  public verifing: boolean = false;
  public loading: boolean = false;
  public password = {
    new: '',
    try: ''
  };
  public type: string = 'password';
  constructor(public account: Account, private http: Http, private snackbar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
  }

  verify(){
    this.verifing = true;
    this.http.request('main','/account/verify','POST', {}, true).then((res:any)=>{
      this.snackbar.open(res['message'], 'باشه', { duration: 5000, direction: 'rtl' });
    }).catch(()=>{
      this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
    })
  }

  verifyPhone(){
    this.loading = true;
    this.http.request('main', '/account/phone', 'POST', { phone: this.account.info.phone.number }, true)
    .then((res:any)=>{
      this.loading = false;
      this.snackbar.open(res['message'], 'باشه', { duration: 5000, direction: 'rtl' });
      if(res['status'] == true && res['expired']) {
        this.dialog.open(VerifyPhoneComponent, {
          autoFocus: false,
          disableClose: true,
          data: {
            expired: res['expired']
          }
        }).afterClosed().subscribe(result=>{
          if(result == true) this.account.info.phone.verified = true;
        });
      }
    })
    .catch(()=>{
      this.loading = false;
      this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
    })
  }

  edit(){
    this.loading = true;
    this.http.request('main', '/account/me', 'PUT', this.account.info, true).then((res:any)=>{
      this.loading = false;
      this.snackbar.open(res['message'], 'باشه', { duration: 5000, direction: 'rtl' });
    }).catch(()=>{
      this.loading = false;
      this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
    })
  }

  change(){
    let password = this.password.new,
      tryPassword = this.password.try;

    if(password.length == 0) this.snackbar.open('رمز عبور جدید را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if(tryPassword.length == 0) this.snackbar.open('تکرار رمز عبور جدید را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if(tryPassword != password) this.snackbar.open('رمزعبور با تکرار آن همخوانی ندارد.', 'باشه', { direction: 'rtl', duration: 4000 });
    else {
      this.loading = true;
      this.http.request('main', '/account/me', 'PUT', { password }, true).then((res:any)=>{
        this.loading = false;
        this.snackbar.open(res['message'], 'باشه', { duration: 5000, direction: 'rtl' });
        if(res['status'] == true){
          this.password = { 'new': '', 'try': '' };
        }
      }).catch(()=>{
        this.loading = false;
        this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
      })
    }
  }
  
  subscribe(){
    
  }
}
