import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
	selector: 'app-delete-blog',
	templateUrl: './delete-blog.component.html',
	styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

	message;
	messageClass;
	foundBlog = false;
	processing = false;
	blog;
	currentUrl;
	dataRegister: any = {};

	constructor(
		private location: Location,
		private activatedRoute: ActivatedRoute,
		private blogService: BlogService,
		private router: Router
	) { }

	deleteBlog() {
		this.processing = true;
		this.blogService.deleteBlog(this.currentUrl.id).subscribe(data => {
			this.dataRegister = data;
			if (!this.dataRegister.success) {
				this.messageClass = 'alert alert-danger';
				this.message = this.dataRegister.message;
			} else {
				this.messageClass = 'alert alert-success';
				this.message = this.dataRegister.message;
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
		this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
			this.dataRegister = data;
			if (!this.dataRegister.success) {
				this.messageClass = 'alert alert-danger';
				this.message = this.dataRegister.message;
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
