import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FlashMessagesService } from '../../modules/flash-messages/flash-messages.service';
import { EventEmitterService } from '../../services/event-emitter.service';
import { BlogService } from '../../services/blog.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-public-profile',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule
	],
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
			data.blogs.forEach(blog => {
				if (blog.leadin) {
					blog.leadin = blog.leadin.replace(/\n/g, "<br>");
				}
			});
			this.publishedPosts = data.blogs;
			this.loading = false;
		});
		setTimeout(() => { this.loading = false; }, 5000);
	}

}
