import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '../../services/http/http.service';
import { MatBottomSheet, MatDialog, MatSnackBar } from '@angular/material';
import { InternetFormComponent } from '../../dialogs/internet-form/internet-form.component';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';

@Component({
  selector: 'app-internet-list',
  templateUrl: './internet-list.component.html',
  styleUrls: ['./internet-list.component.css']
})
export class InternetListComponent implements OnInit {

  public loading: boolean = false;
  public data = [];
  public columns: string[] = ['name', 'category', 'speed', 'time', 'price', 'volumeIn', 'volumeOut', 'edit', 'delete'];
  constructor(private http: Http, private buttonSheet: MatBottomSheet, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.http.grapql('main', `{ internet { id name category speed time volume { in out } each price index } }`)
      .then((res: any) => {
        this.loading = false;
        this.data = res['data']['internet'];
      })
  }

  add() {
    this.openForm(null);
  }

  openForm(data = {}) {
    this.dialog.open(InternetFormComponent, {
      autoFocus: false,
      disableClose: true,
      data
    }).afterClosed().subscribe(result => {
      if (result == true) this.fetch();
    })
  }

  delete(id = '') {
    this.buttonSheet.open(ConfirmComponent, { data: { title: 'حذف تعرفه اینترنت', text: 'آیا شما مطمعن به حذف این تعرفه اینترنتی هستید ؟' } }).afterDismissed().subscribe(result => {
      if (result == true) {
        this.loading = true;
        this.http.request('main', '/api/database/internet', 'DELETE', { id }, true)
          .then((res: any) => {
            this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
            if (res['status'] == true) this.fetch();
            this.loading = false;
          }).catch(() => {
            this.loading = false;
            this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
          })
      }
    });
  }

  getMoney(money = '') {
    money = money.toString();
    return money.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }
}