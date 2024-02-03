import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth.service';
import { EventEmitterService } from '../../../../services/event-emitter.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-published-private',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './published-private.component.html',
  styleUrls: ['./published-private.component.css']
})
export class PublishedPrivateComponent implements OnInit {

  loading;
  privateBlogs;

  constructor(
    private authService: AuthService,
    private eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.eventEmitterService.updateNavbarStatus('show');
    this.getPrivateBlogs();
  }

  getPrivateBlogs() {
    this.loading = true;
    this.authService.getPrivateBlogs().subscribe((data: any) => {
      this.privateBlogs = data.blogs;
      this.loading = false;
    });
    setTimeout(() => { this.loading = false; }, 5000);
  }

}
