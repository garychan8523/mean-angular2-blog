import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { ElementRef } from '@angular/core';

import { FlashMessagesService } from 'angular2-flash-messages';
import { EventEmitterService } from '../../services/event-emitter.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  processing = false;
  form;
  previousUrl;
  logerr = false;
  dataRegister: any = {};

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard,
    private el: ElementRef,
    private flashMessagesService: FlashMessagesService,
    private eventEmitterService: EventEmitterService,
    private socketService: SocketService
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.login(user).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-danger', timeout: 5000 });
        this.processing = false;
        this.enableForm();
        this.logerr = true;
        this.el.nativeElement.querySelector('#username').focus();
      } else {
        this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-success', timeout: 5000 });
        this.authService.storeUserData(this.dataRegister.token, this.dataRegister.user);
        this.socketService.updateSocketToken();
        this.eventEmitterService.updateNavbarUser(user.username);
        setTimeout(() => {
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]);
          } else {
            this.router.navigate(['/feed']);
          }
        }, 2000);
      }
    });
  }

  resetLogerr() {
    this.logerr = false;
  }

  ngOnInit() {
    if (this.authGuard.redirectUrl) {
      this.flashMessagesService.show('you must be logged', { cssClass: 'alert-danger', timeout: 5000 });
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.el.nativeElement.querySelector('#username').focus();
  }

}