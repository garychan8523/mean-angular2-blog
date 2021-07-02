import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';

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
	dataRegister: any = {};

	constructor(
		private authService: AuthService,
		private activatedRoute: ActivatedRoute,
		private flashMessagesService: FlashMessagesService
	) { }

	ngOnInit() {
		this.currentUrl = this.activatedRoute.snapshot.params;
		this.authService.getPublicProfile(this.currentUrl.username).subscribe(data => {
			this.dataRegister = data;
			if (!this.dataRegister.success) {
				this.foundProfile = false;
				this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-danger', timeout: 5000 });
			} else {
				this.foundProfile = true;
				this.username = this.dataRegister.user.username;
				this.email = this.dataRegister.user.email;
			}
		});
	}

}
