import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Account } from '../../services/account/account.service';
import { Http } from '../../services/http/http.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  public permissions: object[] = [
    { name: 'مدیر', value: 'admin' },
    { name: 'مدیر کل', value: 'superadmin' }
  ];
  public email: string = '';
  public password: string = '';
  public permission: string = this.permissions[0]['value'];
  public loading: boolean = false;
  constructor(public dialogRef: MatDialogRef<UserFormComponent>, private snackbar: MatSnackBar, private http: Http, private account: Account) { }

  ngOnInit() {
    document.onkeyup = (event)=>this.keyEvent(event);
  }

  ngOnDestroy(){
    document.onkeyup = null;
  }

  keyEvent(event){    
    if(event.keyCode == 27) this.close();
  }
  
  close(){
    this.dialogRef.close(false);
  }

  submit(){
    let email = this.email,
      password = this.password,
      permission = this.permission;
    
    if(!email || email.length == 0){
      this.snackbar.open('آدرس ایمیل را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    } else if(email == this.account.info.email.address){
      this.snackbar.open('شما نمی توانید دسترسی خود را تغییر دهید.', 'باشه', { direction: 'rtl', duration: 4000 });
    }else if(!permission || permission.length == 0){
      this.snackbar.open('سطح دسترسی را انتخاب کنید..', 'باشه', { direction: 'rtl', duration: 4000 });
    } else {
      this.loading = true;
      this.http.request('main', '/account/new', 'POST', { email, password, permission }, true)
      .then((res:any)=>{
        this.loading = false;
        this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
        if(res['status'] == true) this.dialogRef.close(true);
      }).catch(()=>{
        this.loading = false;
        this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
      })
    }
  }s
}
