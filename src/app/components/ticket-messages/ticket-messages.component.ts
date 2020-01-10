import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet, MatDialog, MatSnackBar } from '@angular/material';
import { Http } from '../../services/http/http.service';
import { Account } from '../../services/account/account.service';
import { Functions } from '../../services/functions/functions.service';
import { MessageAddComponent} from '../../dialogs/message-add/message-add.component';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import settings from '../../../database/ticket';


@Component({
  selector: 'app-ticket-messages',
  templateUrl: './ticket-messages.component.html',
  styleUrls: ['./ticket-messages.component.css']
})
export class TicketMessagesComponent implements OnInit, OnDestroy {

  public messages = [];
  public info = {};
  public loading: boolean = true;
  public id: string = null;
  public settings = settings;
  constructor(public account: Account, private http: Http, public functions: Functions, private activeRoute: ActivatedRoute, private router: Router, private buttonSheet: MatBottomSheet, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit() {
    document.onkeyup = (event)=>{
      if(event.keyCode == 27) this.close();
    }
    this.fetch();
  }
  ngOnDestroy(){
    document.onkeyup = null;
  }

  close(){
    this.router.navigate(['/tickets']);
  }

  getStatus(index=0){    
    switch (index) {
      case 0:
        return 'بسته شده'
      case 1:
        return 'در انتظار پاسخ'
      case 2:
          return 'پاسخ داده شده';
      default:
        break;
    }
  }

  fetch(){
    this.loading = true;
    this.activeRoute.params.subscribe(params=>{
      this.id = params.id;
      this.http.request('main', `/api/ticket/message/${params.id}`, 'GET', {}, true)
      .then((res:any)=>{
        this.loading = false;
        this.messages = res['data'];        
        if(this.messages.length == 0){
          this.router.navigate(['/tickets']);
        } else {
          this.info = this.messages[0]['ticket'];        
        }
      });
    });
  }

  add(){
    this.dialog.open(MessageAddComponent, { data: { id: this.id }, autoFocus: false, disableClose: true }).afterClosed().subscribe(result=>{
      document.onkeyup = (event)=>{
        if(event.keyCode == 27) this.close();
      }
      if(result == true){
        this.fetch();
      }
    });
  }

  closeTicket(){
    this.buttonSheet.open(ConfirmComponent, { data: { title: 'بستن تیکت', text: 'آیا شما مطمعن به بستن این تیکت هستید ؟' } }).afterDismissed().subscribe(result=>{
      if(result == true){
        this.http.request('main', `/api/ticket/close/${this.id}`, 'POST', {}, true).then((res:any)=>{
          this.snackbar.open(res['message'], 'باشه', { direction: 'rtl', duration: 4000 });
          if(res['status'] == true){
            this.info['status'] = 0;
          }
        })
      }
    })
  }
}
