import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth.service';
import { BlogService } from '../../../../services/blog.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.css']
})
export class PublishedComponent implements OnInit {

  loading;
  publishedBlogs;
  username;

  constructor(
    public authService: AuthService,
    private blogService: BlogService,
    private flashMessagesService: FlashMessagesService,
  ) { }

  ngOnInit(): void {
    this.getPublishedBlogs();
  }

  getUsername = new Promise<void>((resolve, reject) => {
    this.authService.getProfile().subscribe((data: any) => {
      if (!data.success) {
        this.authService.logout();
        reject();
      } else {
        this.username = data.user.username;
        resolve();
      }
    });
  });

  getPublishedBlogs() {
    this.loading = true;
    if (!this.username) {
      this.getUsername
        .then(() => {
          this.blogService.getPublishedBlogsByUsername(this.username).subscribe((data: any) => {
            this.publishedBlogs = data.blogs;
            this.loading = false;
          });
        })
        .catch(() => {
          this.loading = false;
          this.flashMessagesService.show('undefined username', { cssClass: 'alert-danger', timeout: 5000 });
        })
    } else {
      this.blogService.getPublishedBlogsByUsername(this.username).subscribe((data: any) => {
        this.publishedBlogs = data.blogs;
        this.loading = false;
      });
    }
    setTimeout(() => { this.loading = false; }, 5000);
  }

}
