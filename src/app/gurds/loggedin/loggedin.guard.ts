import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Account } from '../../services/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedinGuard implements CanActivate {
  constructor(private router: Router, private account: Account) { }
  async canActivate() {
    try {
      await this.account.load();
      if (this.account.login == true) return true;
      else {
        this.router.navigate(['/account/login']);
        return false;
      }
    } catch (error) {
      this.router.navigate(['/account/login']);
      return false;
    }
  }
}
