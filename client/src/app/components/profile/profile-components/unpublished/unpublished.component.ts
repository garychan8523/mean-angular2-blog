import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth.service';
import { EventEmitterService } from '../../../../services/event-emitter.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unpublished',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './unpublished.component.html',
  styleUrls: ['./unpublished.component.css']
})
export class UnpublishedComponent implements OnInit {

  loading;
  unpublishedBlogs;

  constructor(
    private authService: AuthService,
    private eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.eventEmitterService.updateNavbarStatus('show');
    this.getUnpublishedBlogs();
  }

  getUnpublishedBlogs() {
    this.loading = true;
    this.authService.getUnpublishedBlogs().subscribe((data: any) => {
      this.unpublishedBlogs = data.blogs;
      this.loading = false;
    });
    setTimeout(() => { this.loading = false; }, 5000);
  }

}
