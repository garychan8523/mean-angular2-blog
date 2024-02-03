import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth.service';
import { BlogService } from '../../../../services/blog.service';
import { FlashMessagesService } from '../../../../modules/flash-messages/flash-messages.service';
import { EventEmitterService } from '../../../../services/event-emitter.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-published',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.css']
})
export class PublishedComponent implements OnInit {

  loading;
  publishedBlogs;
  username;
  userId;

  constructor(
    public authService: AuthService,
    private blogService: BlogService,
    private flashMessagesService: FlashMessagesService,
    private eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.eventEmitterService.updateNavbarStatus('show');
    this.getPublishedBlogs();
  }

  getUser = new Promise<void>((resolve, reject) => {
    this.authService.getProfile().subscribe((data: any) => {
      if (!data.success) {
        this.authService.logout();
        reject();
      } else {
        this.username = data.user.username;
        this.userId = data.user._id;
        resolve();
      }
    });
  });

  getPublishedBlogs() {
    this.loading = true;
    if (!this.username) {
      this.getUser
        .then(() => {
          this.blogService.getPublishedBlogsByUserId(this.userId).subscribe((data: any) => {
            this.publishedBlogs = data.blogs;
            this.loading = false;
          });
        })
        .catch(() => {
          this.loading = false;
          this.flashMessagesService.show('undefined username', { cssClass: 'alert-danger', timeout: 5000 });
        })
    } else {
      this.blogService.getPublishedBlogsByUserId(this.userId).subscribe((data: any) => {
        this.publishedBlogs = data.blogs;
        this.loading = false;
      });
    }
    setTimeout(() => { this.loading = false; }, 5000);
  }

}
