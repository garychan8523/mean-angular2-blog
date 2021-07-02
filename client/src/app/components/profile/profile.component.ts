import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  mobile;
  routing;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) {
  }

  ngOnInit() {
    if (window.screen.width <= 768) { // 768px portrait
      this.mobile = true;
    }
    this.authService.getProfile().subscribe((profile: any) => {
      if (!profile.success) {
        this.authService.logout();
        window.location.reload();
      }

      console.log('params', this.router.url);
      this.routing = this.router.url;
      if (!this.routing.includes('profile-content')) {
        this.router.navigateByUrl('/profile/(profile-content:personal-details)');
      }
    });
  }

}
