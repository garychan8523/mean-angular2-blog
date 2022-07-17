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

	loading;
	currentUrl;
	username;
	userId;

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
		this.currentUrl = this.activatedRoute.snapshot.params;
		this.authService.getPublicProfile(this.currentUrl.username).subscribe((data: any) => {
			if (!data.success) {
				this.flashMessagesService.show(data.message, { cssClass: 'alert-danger', timeout: 5000 });
			} else {
				this.username = data.user.username;
				this.userId = data.user._id;
				this.getPublishedBlogsByUserId(this.userId);
			}
		});
	}

	getPublishedBlogsByUserId(userId) {
		this.loading = true;
		this.blogService.getPublishedBlogsByUserId(userId).subscribe((data: any) => {
			this.publishedPosts = data.blogs;
			this.publishedPosts.forEach(blog => {
				if (blog.leadin) {
					blog.leadin = blog.leadin.replace(/\n/g, "<br>");
				}
			});
			this.loading = false;
		});
		setTimeout(() => { this.loading = false; }, 5000);
	}

}
