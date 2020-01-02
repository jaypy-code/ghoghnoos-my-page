import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

let password = 'q*=SP8g%}R/$a3/(';

interface Info{
  name: {
    first: string,
    last: string
  },
  phone: {
    number: string,
    verified: boolean
  },
  email: {
    address: string,
    verified: boolean
  },
  verified: boolean,
  permission: string
}

interface Auth{
  access_token: string,
  refresh_token: string
}

@Injectable({
  providedIn: 'root'
})
export class Account {

  public auth: Auth = {
    'access_token': null,
    'refresh_token': null
  };
  public info: Info = {
    'name': {
      'first': '',
      'last': ''
    },
    'phone': {
      'number': '',
      'verified': false
    },
    'email': {
      'address': '',
      'verified': false
    },
    'verified': false,
    'permission': 'user'
  };
  public login: Boolean = false;
  constructor() { }
  async set(auth: Auth, info: Info, remember=false) {
    delete auth['type'];
    delete auth['expire_in'];

    this.auth = auth;
    this.info = info;
    this.login = true;

    const data = await crypto.AES.encrypt(JSON.stringify({ auth }), password);
    if(remember == true){
      window.localStorage.setItem('account', data.toString());
    } else {
      window.sessionStorage.setItem('account', data.toString());
    }
    return Promise.resolve();
  }
  async load() {
    let data = await window.sessionStorage.getItem('account');        
    if(data == null){
      data = await window.localStorage.getItem('account');
    }
    if (data == null) {
      this.login = false;
    } else {
      try {
        let result = await crypto.AES.decrypt(data, password);
        result = await JSON.parse(result.toString(crypto.enc.Utf8));
        this.auth = result['auth'];        
        this.login = true;
        return { auth: this.auth, info: this.info };
      } catch (error) {
        this.login = false;
      }
    }
  }
  logout(){
    this.info = {
      'name':  {
        'first': '',
        'last': ''
      },
      'phone': {
        'number': '',
        'verified': false
      },
      'email': {
        'address': '',
        'verified': false
      },
      'verified': false,
      'permission': 'user'
    };
    this.auth = {
      'access_token': null,
      'refresh_token': null
    };
    this.login = false;
    window.localStorage.removeItem('account');
    window.sessionStorage.removeItem('account');
  }
}
