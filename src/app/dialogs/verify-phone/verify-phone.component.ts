import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Account } from '../../services/account/account.service';
import { Http } from '../../services/http/http.service';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.css']
})
export class VerifyPhoneComponent implements OnInit {

  public loading: boolean = false;
  public token: string = '';
  public value: number = 100;
  private interval;
  constructor(public account: Account, private http: Http, private snackbar: MatSnackBar, private dialogRef: MatDialogRef<VerifyPhoneComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    let expired = this.data.expired;
    let start = Date.now();
    this.interval = setInterval(()=>{
      let now = Date.now();
      if(expired <= now) {
        this.snackbar.open('کد تایید منقضی شد.', 'باشه', { duration: 4000, direction: 'rtl' });
        this.close();
      } else {
        this.value = 100 - (((now - start) / (expired - start)) * 100);        
      }
    }, 100);
  }

  close(){
    this.dialogRef.close(false);
    clearInterval(this.interval);
  }

  submit(){
    let token = this.token;

    if(token.length == 0) return this.snackbar.open('کد تایید را وارد کنید.', 'باشه', { duration: 4000, direction: 'rtl' });
    else if(token.length != 5) return this.snackbar.open('کد تایید باید 5 رقمی باشد.', 'باشه', { duration: 4000, direction: 'rtl' });
    else {
      this.loading = true;
      this.http.request('main', '/account/phone/verify', 'POST', { token }, true)
      .then((res:any)=>{
        this.loading = false;
        this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
        if(res['status'] == true){
          this.dialogRef.close(true);
          clearInterval(this.interval);
        }
      }).catch(()=>{
        this.loading = false;
        this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
      })
    }
  }
}
