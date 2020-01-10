import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../services/account/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public path: string = '';
  constructor(public account: Account, private router: Router) { }

  ngOnInit() {
    this.path = window.location.pathname;
    this.router.events.subscribe(()=>{
      this.path = window.location.pathname;
    });
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

  logout(){
    this.account.logout();
    this.router.navigate(['/']);
  }

  back(){
    if(this.account.info.permission == 'user') this.router.navigate(['/tickets']);
    else window.history.go(-1);
  }
}
