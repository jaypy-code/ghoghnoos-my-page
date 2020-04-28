import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Http } from '../../services/http/http.service';

@Component({
  selector: 'app-internet-form',
  templateUrl: './internet-form.component.html',
  styleUrls: ['./internet-form.component.css']
})
export class InternetFormComponent implements OnInit {

  public name: string = '';
  public category: string = '';
  public speed: number = 0;
  public time: number = 1;
  public volume = {
    in: 0,
    out: 0
  };
  public each: number = 0;
  public price: number = 0;
  public index: boolean = false;
  public loading: boolean = false;
  public id: string = null;
  constructor(public dialogRef: MatDialogRef<InternetFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackbar: MatSnackBar, private http: Http) { }

  ngOnInit() {
    document.onkeyup = (event) => this.keyEvent(event);
    if (this.data != null) {
      this.id = this.data['id'];
      this.name = this.data['name'];
      this.category = this.data['category'];
      this.speed = this.data['speed'];
      this.time = this.data['time'];
      this.volume.in = this.data['volume']['in'];
      this.volume.out = this.data['volume']['out'];
      this.each = this.data['each'];
      this.price = this.data['price'];
      this.index = this.data['index'];
    }
  }

  ngOnDestroy() {
    document.onkeyup = null;
  }

  keyEvent(event) {
    if (event.keyCode == 27) this.close();
  }

  close() {
    this.dialogRef.close(false);
  }

  submit() {
    let name = this.name,
      category = this.category,
      speed = this.speed,
      time = this.time,
      volumeIn = this.volume.in,
      volumeOut = this.volume.out,
      each = this.each,
      price = this.price,
      index = this.index;

    if (name.length == 0) this.snackbar.open('نام تعرفه اینترنت وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if (category.length == 0) this.snackbar.open('دسته بندی تعرفه اینترنت وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if (speed <= 0) this.snackbar.open('سرعت تعرفه اینترنت وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if (time <= 0) this.snackbar.open('مدت زمان تعرفه اینترنت وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if (volumeIn <= 0) this.snackbar.open('حجم داخلی وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if (volumeOut <= 0) this.snackbar.open('حجم بین الملل وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if (price <= 0) this.snackbar.open('هزینه ی تعرفه اینترنت وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else {
      let method = (this.id != null) ? 'PUT' : 'POST';
      let body = { name, category, speed, time, 'volume.in': volumeIn, 'volume.out': volumeOut, each, price, index: index.toString() };
      if (this.id != null) body['id'] = this.id;
      this.http.request('main', '/api/database/internet', method, body, true)
        .then((res: any) => {
          this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
          if (res['status'] == true) this.dialogRef.close(true);
          this.loading = false;
        }).catch(() => {
          this.loading = false;
          this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
        })
    }
  }

}