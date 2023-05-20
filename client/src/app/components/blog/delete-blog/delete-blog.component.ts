import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
	selector: 'app-delete-blog',
	templateUrl: './delete-blog.component.html',
	styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

	foundBlog = false;
	processing = false;
	blog;
	currentUrl;
	dataRegister: any = {};

	constructor(
		private location: Location,
		private activatedRoute: ActivatedRoute,
		private blogService: BlogService,
		private router: Router,
		private flashMessagesService: FlashMessagesService
	) { }

	deleteBlog() {
		this.processing = true;
		this.blogService.deleteBlog(this.currentUrl.id).subscribe(data => {
			this.dataRegister = data;
			if (!this.dataRegister.success) {
				this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-danger', timeout: 5000 });
			} else {
				this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-success', timeout: 5000 });
				setTimeout(() => {
					this.router.navigate(['/blog']);
				}, 2000);
			}
		});
	}

	goBack() {
		this.location.back();
	}
	ngOnInit() {
		this.currentUrl = this.activatedRoute.snapshot.params;
		this.blogService.getBlog(this.currentUrl.id).subscribe(data => {
			this.dataRegister = data;
			if (!this.dataRegister.success) {
				this.flashMessagesService.show(this.dataRegister.message, { cssClass: 'alert-danger', timeout: 5000 });
			} else {
				this.blog = {
					title: this.dataRegister.blog.title,
					body: this.dataRegister.blog.body,
					createdBy: this.dataRegister.blog.createdBy,
					createdAt: this.dataRegister.blog.createdAt
				}
				this.foundBlog = true;
			}
		});
	}

}
