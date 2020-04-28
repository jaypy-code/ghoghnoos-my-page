import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '../../services/http/http.service';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  public loading: boolean = false;
  public data: object[] = [];
  public columns: string[] = ['title', 'edit', 'delete'];
  constructor(private router: Router , private http: Http, private buttonSheet: MatBottomSheet, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.fetch();
  }

  fetch(){
    this.loading = true;
    this.http.grapql('main', `{ posts(all:true) { data { id title } } }`)
    .then((res:any)=>{
      this.loading = false;
      this.data = res['data']['posts']['data'];
    })
  }

  add(){
    this.router.navigate(['/post/new']);
  }

  edit(id=''){
    this.router.navigate([`/post/${id}`])
  }

  delete(id=''){
    this.buttonSheet.open(ConfirmComponent, { data: { title: 'حذف نوشته', text: 'آیا شما مطمعن به حذف این نوشته هستید ؟' } }).afterDismissed().subscribe(result=>{
      if(result == true){
        this.loading = true;
        this.http.request('main', '/api/database/post', 'DELETE', { id }, true)
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
}