import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form;
  previousUrl;
  logerr = false;
  dataRegister: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard,
    private el: ElementRef
  ) {
    this.createForm(); // Create Login Form when component is constructed
  }

  // Function to create login form
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
  }

  // Function to disable form
  disableForm() {
    this.form.controls['username'].disable(); // Disable username field
    this.form.controls['password'].disable(); // Disable password field
  }

  // Function to enable form
  enableForm() {
    this.form.controls['username'].enable(); // Enable username field
    this.form.controls['password'].enable(); // Enable password field
  }

  // Functiont to submit form and login user
  onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }

    // Function to send login data to API
    this.authService.login(user).subscribe(data => {
      // Check if response was a success or error
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = this.dataRegister.message; // Set error message
        this.processing = false; // Enable submit button
        this.enableForm(); // Enable form for editting
        this.logerr = true;
        this.el.nativeElement.querySelector('#username').focus();
      } else {
        this.messageClass = 'alert alert-success'; // Set bootstrap success class
        this.message = this.dataRegister.message; // Set success message
        // Function to store user's token in client local storage
        this.authService.storeUserData(this.dataRegister.token, this.dataRegister.user);
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]);
          } else {
            this.router.navigate(['/dashboard']);
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
      this.messageClass = 'alert alert-danger';
      this.message = 'you must be logged';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.el.nativeElement.querySelector('#username').focus();
  }

}