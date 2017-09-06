import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ViewChildren } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	form: FormGroup;
	message;
	messageClass;
	processing = false;
	emailValid = true;
	emailMessage;
	usernameValid = true;
	usernameMessage;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router
	) {
    	this.createForm();
  	}

	createForm() {
		this.form = this.fb.group({
		 username: ['', Validators.compose([
		 	Validators.required,
		 	Validators.minLength(3),
		 	Validators.maxLength(15),
		 	this.validateUsername
		 	])],
		 email: ['', Validators.compose([
		 	Validators.required,
		 	Validators.minLength(6),
		 	Validators.maxLength(254),
		 	this.validateEmail
		 	])],
		 password: ['', Validators.compose([
		 	Validators.required,
		 	Validators.minLength(8),
		 	Validators.maxLength(35),
		 	this.validatePassword
		 	])],
		 confirm: ['', Validators.required]
		}, { validator: this.matchingPasswords('password', 'confirm') });
	}

	disableForm() {
		this.form.controls['username'].disable();
		this.form.controls['email'].disable();
		this.form.controls['password'].disable();
		this.form.controls['confirm'].disable();
	}

	enableForm() {
		this.form.controls['username'].enable();
		this.form.controls['email'].enable();
		this.form.controls['password'].enable();
		this.form.controls['confirm'].enable();
	}

	validateEmail(controls) {
		const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		if(regExp.test(controls.value)) {
			return null;
		} else {
			return { 'validateEmail': true };
		}
	}

	validateUsername(controls) {
		const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
		if(regExp.test(controls.value)) {
			return null;
		} else {
			return { 'validateUsername': true };
		}
	}

	validatePassword(controls) {
		const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
		if(regExp.test(controls.value)) {
			return null;
		} else {
			return { 'validatePassword': true };
		}
	}

	matchingPasswords(password, confirm) {
		return (group: FormGroup) => {
			if (group.controls[password].value === group.controls[confirm].value) {
				return null;
			} else {
				return { 'matchingPasswords': true };
			}
		}
	}

	onRegisterSubmit() {
		this.processing = true;
		this.disableForm();
		const user = {
			email: this.form.get('email').value,
			username: this.form.get('username').value,
			password: this.form.get('password').value
		}

		this.authService.registerUser(user).subscribe(data => {
			if (!data.success) {
				this.messageClass = 'alert alert-danger';
				this.message = data.message;
				this.processing = false;
				this.enableForm();
			} else {
				this.messageClass = 'alert alert-success';
				this.message = data.message;
				setTimeout(() => {
					this.router.navigate(['/login']);
				}, 2000);
			}
		});
	}

	checkUsername() {
		const username = this.form.get('username').value;
		this.authService.checkUsername(username).subscribe(data => {
			if (!data.success) {
				this.usernameValid = false;
				this.usernameMessage = data.message;
			} else {
				this.usernameValid = true;
				this.usernameMessage = data.message;
			}
		});
	}

	checkEmail() {
		const email = this.form.get('email').value;
		this.authService.checkEmail(email).subscribe(data => {
			if (!data.success) {
				this.emailValid = false;
				this.emailMessage = data.message;
			} else {
				this.emailValid = true;
				this.emailMessage = data.message;
			}
		});
	}

  ngOnInit() {
  }

}
