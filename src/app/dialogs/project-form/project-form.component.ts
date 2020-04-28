import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Http } from '../../services/http/http.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  public name: string = '';
  public details: string = '';
  public category: string = '';
  public url: string = '';
  public loading: boolean = false;
  public id: string = null;
  constructor(public dialogRef: MatDialogRef<ProjectFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackbar: MatSnackBar, private http: Http) { }

  ngOnInit() {
    document.onkeyup = (event) => this.keyEvent(event);
    if (this.data != null) {
      this.id = this.data['id'];
      this.name = this.data['name'];
      this.details = this.data['details'];
      this.category = this.data['category'];
      this.url = this.data['url'];
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
      details = this.details,
      category = this.category,
      url = this.url;

    if (name.length == 0) this.snackbar.open('نام پروژه وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if (details.length == 0) this.snackbar.open('جزئیات پروژه وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if (category.length == 0) this.snackbar.open('دسته بندی پروژه وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if (url.length == 0) this.snackbar.open('آدرس پروژه وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else {
      let method = (this.id != null) ? 'PUT' : 'POST';
      let body = { name, details, category, url };
      if (this.id != null) body['id'] = this.id;
      this.http.request('main', '/api/database/project', method, body, true)
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