import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Http } from '../../services/http/http.service';

@Component({
  selector: 'app-message-add',
  templateUrl: './message-add.component.html',
  styleUrls: ['./message-add.component.css']
})
export class MessageAddComponent implements OnInit, OnDestroy {

  public content: string = '';
  public loading: boolean = false;
  constructor(public dialogRef: MatDialogRef<MessageAddComponent>, private snackbar: MatSnackBar, private http: Http, @Inject(MAT_DIALOG_DATA) private data) { }

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
    let content = this.content;
    
    if(this.data['id'] == null) this.close();

    if(!content || content.length == 0){
      this.snackbar.open('متن تیکت را وارد کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    } else {
      this.loading = true;
      this.http.request('main', `/api/ticket/message/${this.data['id']}`, 'POST', { content }, true)
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
