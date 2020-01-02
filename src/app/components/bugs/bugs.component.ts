import { Component, OnInit } from '@angular/core';
import { Http } from '../../services/http/http.service';
import { Account } from '../../services/account/account.service';
import { MatDialog } from '@angular/material';
import { BugFormComponent } from '../../dialogs/bug-form/bug-form.component';
import { BugInfoComponent } from '../../dialogs/bug-info/bug-info.component';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.css']
})
export class BugsComponent implements OnInit {

  public loading: boolean = false;
  public data: object[] = [];
  public columns: string[] = ['project', 'sentAt', 'more'];
  constructor(private http: Http, private dialog: MatDialog, public account: Account) { }

  ngOnInit() {
    this.fetch();
  }

  fetch(){
    this.loading = true;
    this.http.request('main', '/api/bug', 'GET', {}, true)
    .then((res:any)=>{
      this.loading = false;
      this.data = res['data'];
    });
  }

  add(){
    this.dialog.open(BugFormComponent , {
      autoFocus: false,
      disableClose: true,
    }).afterClosed().subscribe(result=>{
      if(result == true) this.fetch();
    })
  }

  whenCreated(at) {
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

  more(data={}){
    this.dialog.open(BugInfoComponent, {
      autoFocus: false,
      disableClose: true,
      data
    });
  }
}
