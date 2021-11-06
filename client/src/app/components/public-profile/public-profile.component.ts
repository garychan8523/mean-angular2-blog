import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';
import { EventEmitterService } from '../../services/event-emitter.service';
import { BlogService } from '../../services/blog.service';

@Component({
	selector: 'app-public-profile',
	templateUrl: './public-profile.component.html',
	styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

	currentUrl;
	username;
	email;
	dataRegister: any = {};

	loadingBlogs;
	publishedPosts;

	constructor(
		public authService: AuthService,
		private activatedRoute: ActivatedRoute,
		private flashMessagesService: FlashMessagesService,
		private eventEmitterService: EventEmitterService,
		private blogService: BlogService,
	) { }

	ngOnInit() {
		this.eventEmitterService.updateNavbarStatus('show');
		this.loadingBlogs = true;
		this.currentUrl = this.activatedRoute.snapshot.params;
		this.authService.getPublicProfile(this.currentUrl.username).subscribe(data => {
			this.dataRegister = data;
			if (!this.dataRegister.success) {
				this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-danger', timeout: 5000 });
			} else {
				this.username = this.dataRegister.user.username;
				this.getPublishedBlogsByUsername(this.username);
				this.email = this.dataRegister.user.email;
			}
		});
	}

	getPublishedBlogsByUsername(username) {
		this.loadingBlogs = true;
		this.blogService.getPublishedBlogsByUsername(username).subscribe((data: any) => {
			this.publishedPosts = data.blogs;
			this.publishedPosts.forEach(blog => {
				if (blog.leadin) {
					blog.leadin = blog.leadin.replace(/\n/g, "<br>");
				}
			});
			this.loadingBlogs = false;
		});
		setTimeout(() => { this.loadingBlogs = false; }, 5000);
	}

}
