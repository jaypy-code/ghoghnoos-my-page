import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Http } from '../../services/http/http.service';
import { WalletAddComponent } from '../../dialogs/wallet-add/wallet-add.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  public transactions: object[] = null;
  public max: number = 0;
  public columns: string[] = ['add', 'description', 'amount', 'status', 'date'];
  constructor(private dialog: MatDialog, private http: Http) { }

  ngOnInit() {
    this.fetch();
  }

  fetch(){
    this.http.request('main', '/api/transactions', 'GET', {}, true)
    .then((res:any)=>{
      this.transactions = res['data'];      
      if(this.transactions.length != 0){
        this.setMax();
      }
    })
  }

  setMax(){
    let max = 0;
    for(let i in this.transactions){
      if(this.transactions[i]['status'] == true) max += this.transactions[i]['amount'];
    }
    this.max = max
  }

  add(){
    this.dialog.open(WalletAddComponent, { autoFocus: false, disableClose: true });
  }

  ToRial(amount=0) {
    let str = amount.toString();
    str = str.replace(/\,/g, '');
    var objRegex = new RegExp('(-?[0-9]+)([0-9]{3})');
    while (objRegex.test(str)) {
        str = str.replace(objRegex, '$1,$2');
    }
    return str;
  }

  whenCreated(at) {
    if(at == null) return "بدون زمان";
    let date = new Date(at);
    let now = new Date();

    if ((now.getFullYear() - date.getFullYear()) != 0) {
      return (now.getFullYear() - date.getFullYear()) + " سال پیش";
    } else if (((now.getMonth() + 1) - (date.getMonth() + 1)) != 0) {
      return ((now.getMonth() + 1) - (date.getMonth() + 1)) + " ماه پیش";
    } else if (((now.getDate() + 1) - (date.getDate() + 1)) != 0) {
      return (now.getDate() + 1) - (date.getDate() + 1) + " روز پیش";
    } else if ((now.getHours() - date.getHours()) != 0) {
      return (now.getHours() - date.getHours()) + " ساعت پیش";
    } else {
      return "چند لحظه پیش"
    }
  }
}
