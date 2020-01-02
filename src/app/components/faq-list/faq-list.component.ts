import { Component, OnInit } from '@angular/core';
import { Http } from '../../services/http/http.service';
import { MatBottomSheet, MatDialog, MatSnackBar } from '@angular/material';
import { FaqFormComponent } from '../../dialogs/faq-form/faq-form.component';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.css']
})
export class FaqListComponent implements OnInit {

  public loading: boolean = false;
  public data: object[] = [];
  public columns: string[] = ['star', 'title', 'edit', 'delete'];
  constructor(private http: Http, private buttonSheet: MatBottomSheet, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.fetch();
  }

  fetch(){
    this.loading = true;
    this.http.grapql('main', `{ faqs { id title content star } }`)
    .then((res:any)=>{
      this.loading = false;
      this.data = res['data']['faqs'];      
    })
  }

  add(){
    this.openForm(null);
  }
  
  openForm(data={}){
    this.dialog.open(FaqFormComponent , {
      autoFocus: false,
      disableClose: true,
      data
    }).afterClosed().subscribe(result=>{
      if(result == true) this.fetch();
    })
  }

  delete(id=''){
    this.buttonSheet.open(ConfirmComponent, { data: { title: 'حذف سوال', text: 'آیا شما مطمعن به حذف این سوال هستید ؟' } }).afterDismissed().subscribe(result=>{
      if(result == true){
        this.loading = true;
        this.http.request('main', '/api/database/faq', 'DELETE', { id }, true)
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
