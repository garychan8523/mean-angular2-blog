import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-public-profile',
	templateUrl: './public-profile.component.html',
	styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

	currentUrl;
	username;
	email;
	foundProfile = false;
	messageClass;
	message;
	dataRegister: any = {};

	constructor(
		private authService: AuthService,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {
		this.currentUrl = this.activatedRoute.snapshot.params;
		this.authService.getPublicProfile(this.currentUrl.username).subscribe(data => {
			this.dataRegister = data;
			if (!this.dataRegister.success) {
				this.foundProfile = false;
				this.messageClass = 'alert alert-danger';
				this.message = this.dataRegister.message;
			} else {
				this.foundProfile = true;
				this.username = this.dataRegister.user.username;
				this.email = this.dataRegister.user.email;
			}
		});
	}

}
