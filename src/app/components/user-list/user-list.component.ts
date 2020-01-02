import { Component, OnInit } from '@angular/core';
import { Account } from '../../services/account/account.service';
import { Http } from '../../services/http/http.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UserFormComponent } from '../../dialogs/user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public data: object[] = [];
  public loading: boolean = false;
  public columns: string[] = ['name', 'email', 'permission', 'verified'];
  public permissions: object[] = [
    { name: 'کاربر', value: 'user' },
    { name: 'مدیر', value: 'admin' },
    { name: 'مدیر کل', value: 'superadmin' }
  ];
  constructor(public account: Account ,private http: Http, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.fetch();
  }

  fetch(){
    this.loading = true;
    this.http.grapql('main', `{ users { id name { first last } email permission verified } }`, true)
    .then((res:any)=>{
      this.loading = false;
      this.data = res['data']['users'];
    }).catch(()=>{
      this.loading = false;
      this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
    })
  }

  changePermission(event, email){
    this.loading = true;
    this.http.request('main', '/account/new', 'POST', { email, permission: event.value }, true)
    .then((res:any)=>{
      this.loading = false;
      this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
      if(res['status'] == true) this.fetch();
    }).catch(()=>{
      this.loading = false;
      this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
    })
  }

  add(){
    this.dialog.open(UserFormComponent , {
      autoFocus: false,
      disableClose: true,
    }).afterClosed().subscribe(result=>{
      if(result == true) this.fetch();
    })
  }
  
}
