import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-published-private',
  templateUrl: './published-private.component.html',
  styleUrls: ['./published-private.component.css']
})
export class PublishedPrivateComponent implements OnInit {

  loading;
  privateBlogs;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
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
