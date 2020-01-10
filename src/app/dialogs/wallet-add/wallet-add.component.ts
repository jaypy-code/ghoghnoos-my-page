import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Account } from '../../services/account/account.service';
import { Http } from '../../services/http/http.service';

@Component({
  selector: 'app-wallet-add',
  templateUrl: './wallet-add.component.html',
  styleUrls: ['./wallet-add.component.css']
})
export class WalletAddComponent implements OnInit {

  public amount: number = 0;
  public amounts: number[] = [1000, 5000, 10000];
  public loading: boolean = false;
  constructor(public dialogRef: MatDialogRef<WalletAddComponent>, private snackbar: MatSnackBar, private http: Http, public account: Account) { }


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
  ToRial(amount=0) {
    let str = amount.toString();
    str = str.replace(/\,/g, '');
    var objRegex = new RegExp('(-?[0-9]+)([0-9]{3})');
    while (objRegex.test(str)) {
        str = str.replace(objRegex, '$1,$2');
    }
    return str;
  }

  minesAmount(){
    if(this.amount - 1000 <= 0) this.amount = 0;
    else this.amount -= 1000;
  }

  addAmount(){
    this.amount += 1000;
  }

  keyInput(event){
    event.preventDefault();
    if(event.keyCode == 38) this.addAmount();
    if(event.keyCode == 40) this.minesAmount();
  }

  submit(){
    if(this.amount < this.amounts[0]){
      this.snackbar.open('مبلغ پرداختی کم است !', 'باشه', { direction: 'rtl', duration: 4000 });
      this.amount = 0;
    } else {
      this.loading = true;
      this.http.request('main', '/api/payment', 'POST', { amount: this.amount }, true)
      .then((res:any)=>{
        this.loading = false;
        if(res['status'] == true){
          window.location.href = (res['url']);
        } else {
          this.snackbar.open(res['message'], 'باشه', { duration: 4000, direction: 'rtl' });
          this.close();
        }
      });
    }
  }
}
