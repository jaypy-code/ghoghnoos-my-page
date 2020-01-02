import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Http } from '../../services/http/http.service';
import settings from '../../../database/ticket';

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.css']
})
export class TicketAddComponent implements OnInit, OnDestroy {

  public title: string = '';
  public content: string = '';
  public strange: number = 0;
  public department: string = '';
  public loading: boolean = false;
  public settings = settings;
  constructor(public dialogRef: MatDialogRef<TicketAddComponent>, private snackbar: MatSnackBar, private http: Http) { }

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
    let title = this.title,
      strange = this.strange,
      department = this.department,
      content = this.content;
        
    if(!title || title.length == 0){
      this.snackbar.open('موضوع تیکت را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    } else if(!department || department.length == 0){
      this.snackbar.open('دپارتمان تیکت را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    } else if(!content || content.length == 0){
      this.snackbar.open('متن تیکت را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    } else {
      this.loading = true;

      this.http.request('main', '/api/ticket', 'POST', { ticket: { title, strange, department }, message: { content } }, true)
      .then((res:any)=>{
        this.loading = false;
        this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
        if(res['status'] == true) this.dialogRef.close(true);
      }).catch(()=>{
        this.loading = false;
        this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
      })
    }
  }
}
