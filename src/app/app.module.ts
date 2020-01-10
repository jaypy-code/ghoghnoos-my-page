import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule  } from './material';
import { CKEditorModule } from 'ngx-ckeditor'; // Content editor
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { LoggedinGuard } from './gurds/loggedin/loggedin.guard';

// Components
import { AuthComponent } from './components/auth/auth.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { TicketListsComponent } from './components/ticket-lists/ticket-lists.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TicketMessagesComponent } from './components/ticket-messages/ticket-messages.component';
import { BugsComponent } from './components/bugs/bugs.component';
import { ChatUserComponent } from './components/chat-user/chat-user.component';
import { ChatToComponent } from './components/chat-to/chat-to.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { CallComponent } from './components/call/call.component';

// Includes
import { HeaderComponent } from './includes/header/header.component';

// Dialogs
import { TicketAddComponent } from './dialogs/ticket-add/ticket-add.component';
import { MessageAddComponent } from './dialogs/message-add/message-add.component';
import { ConfirmComponent } from './dialogs/confirm/confirm.component';
import { BugFormComponent } from './dialogs/bug-form/bug-form.component';
import { BugInfoComponent } from './dialogs/bug-info/bug-info.component';
import { VerifyPhoneComponent } from './dialogs/verify-phone/verify-phone.component';
import { WalletAddComponent } from './dialogs/wallet-add/wallet-add.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    TicketListsComponent,
    HeaderComponent,
    AuthComponent,
    ProfileComponent,
    TicketAddComponent,
    TicketMessagesComponent,
    MessageAddComponent,
    ConfirmComponent,
    ForgetPasswordComponent,
    BugsComponent,
    BugFormComponent,
    BugInfoComponent,
    ChatUserComponent,
    ChatToComponent,
    VerifyPhoneComponent,
    CallComponent,
    WalletComponent,
    WalletAddComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    CKEditorModule,
    RecaptchaV3Module,
    RouterModule.forRoot([
      { path: 'account/login', component: AuthComponent },
      { path: 'account/register', component: AuthComponent },
      { path: 'account/forget', component: ForgetPasswordComponent },
      { path: 'account/profile', component: ProfileComponent, canActivate: [LoggedinGuard] },
      { path: 'tickets', component: TicketListsComponent, canActivate: [LoggedinGuard] },
      { path: 'tickets/:id', component: TicketMessagesComponent, canActivate: [LoggedinGuard] },
      { path: 'bugs', component: BugsComponent, canActivate: [LoggedinGuard] },
      { path: 'chat', component: ChatUserComponent, canActivate: [LoggedinGuard] },
      { path: 'chat/:id', component: ChatToComponent, canActivate: [LoggedinGuard] },
      { path: 'call', component: CallComponent, canActivate: [LoggedinGuard] },
      { path: 'account/profile/wallet', component: WalletComponent, canActivate: [LoggedinGuard] },
      { path: '**', redirectTo: '/account/login' }
    ]),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6Lc0V8oUAAAAAFy10s-Ubp106Fp40tijOxZnViug' },
  ],
  entryComponents: [TicketAddComponent, WalletAddComponent, MessageAddComponent, BugFormComponent, BugInfoComponent, VerifyPhoneComponent, ConfirmComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
