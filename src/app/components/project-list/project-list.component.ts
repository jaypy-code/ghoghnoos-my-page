import { Component, OnInit } from '@angular/core';
import { Http } from '../../services/http/http.service';
import { MatBottomSheet, MatDialog, MatSnackBar } from '@angular/material';
import { ProjectFormComponent } from '../../dialogs/project-form/project-form.component';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  public loading: boolean = false;
  public data: object[] = [];
  public columns: string[] = ['star', 'title', 'edit', 'delete'];
  constructor(private http: Http, private buttonSheet: MatBottomSheet, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.fetch();
  }

  fetch(){
    this.loading = true;
    this.http.grapql('main', `{ projects { id name details category url } }`)
    .then((res:any)=>{
      this.loading = false;
      this.data = res['data']['projects'];      
    })
  }

  add(){
    this.openForm(null);
  }

  openForm(data={}){
    this.dialog.open(ProjectFormComponent , {
      autoFocus: false,
      disableClose: true,
      data
    }).afterClosed().subscribe(result=>{
      if(result == true) this.fetch();
    })
  }

  delete(id=''){
    this.buttonSheet.open(ConfirmComponent, { data: { title: 'حذف پروژه', text: 'آیا شما مطمعن به حذف این پروژه هستید ؟' } }).afterDismissed().subscribe(result=>{
      if(result == true){
        this.loading = true;
        this.http.request('main', '/api/database/project', 'DELETE', { id }, true)
        .then((res:any)=>{
          this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
          if(res['status'] == true) this.fetch();
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
          this.snackbar.open('خطا با ارتباط با سرور', 'باشه', { direction: 'rtl', duration: 4000 });
        })
      }
    });
  }

  goTo(url=''){
    window.open(url);
  }
}