import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../services/account/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public account: Account, private router: Router) { }

  ngOnInit() {
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
