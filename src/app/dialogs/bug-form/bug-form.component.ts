import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef,  MatSnackBar } from '@angular/material';
import { Http } from '../../services/http/http.service';

@Component({
  selector: 'app-bug-form',
  templateUrl: './bug-form.component.html',
  styleUrls: ['./bug-form.component.css']
})
export class BugFormComponent implements OnInit, OnDestroy {

  public loading: boolean = false;
  public projects: object[] = [];
  public project: string = '';
  public content: string = '';
  constructor(public dialogRef: MatDialogRef<BugFormComponent>, private snackbar: MatSnackBar, private http: Http) { }

  ngOnInit() {
    this.fetch();
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

  fetch(){
    this.loading = true;
    this.http.grapql('main', `{ projects { id name } }`)
    .then((res:any)=>{
      this.loading = false;
      this.projects = res['data']['projects'];
    })
  }

  submit(){
    let project = this.project,
      content = this.content;
    
    if(project.length == 0) this.snackbar.open('پروژه ای که خطا رخ داده است را انتخاب کنید.', 'باشه', { direction: 'rtl', duration: 4000 });
    else if(content.length == 0) this.snackbar.open('توضیحات گزارش خود را بنویسید.', 'باشه', { direction: 'rtl', duration: 4000 });
    else {
      this.loading = true;
      this.http.request('main', '/api/bug', 'POST', { project, content }, true)
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
