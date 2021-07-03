import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-unpublished',
  templateUrl: './unpublished.component.html',
  styleUrls: ['./unpublished.component.css']
})
export class UnpublishedComponent implements OnInit {

  loading;
  unpublishedBlogs;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
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
