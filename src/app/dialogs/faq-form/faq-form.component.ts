import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,  MatSnackBar } from '@angular/material';
import { Http } from '../../services/http/http.service';

@Component({
  selector: 'app-faq-form',
  templateUrl: './faq-form.component.html',
  styleUrls: ['./faq-form.component.css']
})
export class FaqFormComponent implements OnInit, OnDestroy {

  public title: string = '';
  public content: string = '';
  public star: boolean = false;
  public loading: boolean = false;
  public id: string = null;
  constructor(public dialogRef: MatDialogRef<FaqFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackbar: MatSnackBar, private http: Http) { }

  ngOnInit() {
    document.onkeyup = (event)=>this.keyEvent(event);
    if(this.data != null){
      this.id = this.data['id'];
      this.title = this.data['title'];
      this.content = this.data['content'];
      this.star = this.data['star'];
    }
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
    let title = this.title,
      content = this.content;
      
    if(title.length == 0) this.snackbar.open('عنوان سوال وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if(content.length == 0) this.snackbar.open('جواب سوال پروژه وارد نشده است.', 'باشه', { direction: 'rtl', duration: 4000 });
    else {
      let method = (this.id != null)?'PUT':'POST';
      let body =  { title, content, star: this.star.toString() };
      if(this.id != null) body['id'] = this.id;
      this.http.request('main', '/api/database/faq', method, body, true)
      .then((res:any)=>{
        this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
        if(res['status'] == true) this.dialogRef.close(true);
        this.loading = false;
      }).catch(()=>{
        this.loading = false;
        this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
      })
    }
  }
}
