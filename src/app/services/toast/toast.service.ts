import { Injectable } from '@angular/core';
let TIMEOUT = null;

@Injectable({
  providedIn: 'root'
})
export class Toast {

  constructor() { }
  make(message = '', timeout = 3000) {
    clearTimeout(TIMEOUT);
    if (document.getElementById('toast')) {
      document.getElementById('toast').classList.add('hide');
      setTimeout(() => {
        document.body.removeChild(document.getElementById('toast'));
        make(message, timeout);
      }, 300);
    } else {
      make(message, timeout);
    }
  }
}

function make(message = '', timeout = 3000,) {
  timeout += 700;
  let div = document.createElement('div');
  div.classList.add('toast');
  div.id = 'toast';
  div.innerText = (message) ? message : "خطایی رخ داده است.";

  document.body.appendChild(div);

  TIMEOUT = setTimeout(() => {
    document.getElementById('toast').classList.add('hide');
    setTimeout(() => {
      if (document.getElementById('toast')) document.body.removeChild(document.getElementById('toast'));
      TIMEOUT = null;
    }, 500);
  }, timeout);
}
