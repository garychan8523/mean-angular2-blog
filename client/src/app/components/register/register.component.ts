import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ViewChildren } from '@angular/core';
import { ElementRef } from '@angular/core';

import { FlashMessagesService } from '../../modules/flash-messages/flash-messages.service';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule
	],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	form;
	processing = false;
	emailValid = true;
	emailMessage;
	usernameValid = true;
	usernameMessage;
	_timeout: any = null;
	dataRegister: any = {};

	constructor(
		private fb: UntypedFormBuilder,
		private authService: AuthService,
		private router: Router,
		private el: ElementRef,
		private flashMessagesService: FlashMessagesService
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
		if (regExp.test(controls.value)) {
			return null;
		} else {
			return { 'validateEmail': true };
		}
	}

	validateUsername(controls) {
		const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
		if (regExp.test(controls.value)) {
			return null;
		} else {
			return { 'validateUsername': true };
		}
	}

	validatePassword(controls) {
		const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
		if (regExp.test(controls.value)) {
			return null;
		} else {
			return { 'validatePassword': true };
		}
	}

	matchingPasswords(password, confirm) {
		return (group: UntypedFormGroup) => {
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
			this.dataRegister = data;
			if (!this.dataRegister.success) {
				this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-danger', timeout: 5000 });
				this.processing = false;
				this.enableForm();
			} else {
				this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-success', timeout: 5000 });
				setTimeout(() => {
					this.router.navigate(['/login']);
				}, 2000);
			}
		});
	}

	checkUsername(errors, valid) {
		this._timeout = null;
		if (this._timeout) { //if there is already a timeout in process cancel it
			window.clearTimeout(this._timeout);
		}
		this._timeout = window.setTimeout(() => {
			this._timeout = null;
			const username = this.form.get('username').value;
			let invalid = !valid;
			if ((errors || invalid) && (username != '')) {
				//this.el.nativeElement.querySelector('#username').focus();
			}
			if (username !== '') {
				this.authService.checkUsername(username).subscribe(data => {
					this.dataRegister = data;
					if (!this.dataRegister.success) {
						this.usernameValid = false;
						this.usernameMessage = this.dataRegister.message;
						//this.el.nativeElement.querySelector('#username').focus();
					} else {
						this.usernameValid = true;
						this.usernameMessage = this.dataRegister.message;
					}
				});
			}
		}, 1000);
	}

	checkEmail(errors, valid) {
		this._timeout = null;
		if (this._timeout) { //if there is already a timeout in process cancel it
			window.clearTimeout(this._timeout);
		}
		this._timeout = window.setTimeout(() => {
			this._timeout = null;
			const email = this.form.get('email').value;
			let invalid = !valid;
			if ((errors || invalid) && (email != '')) {
				//this.el.nativeElement.querySelector('#email').focus();
			}
			if (email !== '') {
				this.authService.checkEmail(email).subscribe(data => {
					this.dataRegister = data;
					if (!this.dataRegister.success) {
						this.emailValid = false;
						this.emailMessage = this.dataRegister.message;
						//this.el.nativeElement.querySelector('#email').focus();
					} else {
						this.emailValid = true;
						this.emailMessage = this.dataRegister.message;
					}
				});
			}
		}, 1000);
	}

	ngOnInit() {
		this.el.nativeElement.querySelector('#username').focus();
	}

}
