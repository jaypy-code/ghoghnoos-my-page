import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../services/account/account.service';
import { Http } from '../../services/http/http.service';
import { Functions } from '../../services/functions/functions.service';
import { MatDialog } from '@angular/material/dialog';
import { TicketAddComponent } from '../../dialogs/ticket-add/ticket-add.component';
import settings from '../../../database/ticket';

@Component({
  selector: 'app-ticket-lists',
  templateUrl: './ticket-lists.component.html',
  styleUrls: ['./ticket-lists.component.css']
})
export class TicketListsComponent implements OnInit, OnDestroy {

  public loading: boolean = true;
  public columns: string[] = ['index', 'status', 'ago', 'strange', 'department', 'title', 'show'];
  public data = [];
  public status: number = -1;
  public strange: number = -1;
  public department: string = 'null';
  public settings = settings;
  constructor(public account: Account, private http: Http, public functions: Functions, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.fetch();
    if(this.account.info.permission != 'user'){
      document.onkeydown = (event)=> {
        if(event.keyCode == 116){
          event.preventDefault();
          this.fetch()
        }
      }
    }
  }
  
  ngOnDestroy(){
    document.onkeydown = null;
  }


  fetch(){
    this.loading = true;
    
    if(this.account.info.permission != 'user'){
      this.loading = false;
      let filter = '(';
      if(this.status != -1) filter += `status: ${this.status}, `;
      if(this.strange != -1) filter += `strange: ${this.strange}, `;
      if(this.department != 'null') filter += `department: "${this.department}", `;
      filter += ')';
      if(filter.length == 2) filter = '';
      this.http.grapql('main', `{ tickets${filter} { id title createdAt department strange status } }`, true)
      .then((res:any)=>{
        this.loading = false;
        this.data = res['data']['tickets'];
      }).catch(()=>{
        this.loading = false;
        this.data = [];
      })
    } else {
      this.http.request('main', '/api/ticket', 'GET', {}, true).then((res:any)=>{
        this.data = res['data'];
        this.loading = false;
      }).catch(()=>{
        this.loading = false;
        this.data = [];
      })
    }
  }

  add(){
    this.dialog.open(TicketAddComponent, {
      autoFocus: false,
      disableClose: true,
    }).afterClosed().subscribe(result=>{
      if(result == true) this.fetch();
    })
  }

  show(ticket){
    let id = null
    if(ticket._id != null) id = ticket._id;
    if(ticket.id != null) id = ticket.id;
    if(id != null){
      this.router.navigate([`/tickets/${id}`])
    }
  }
}
