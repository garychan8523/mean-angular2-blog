import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements AfterViewChecked, OnInit {

  mobile;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) {
  }

  ngAfterViewChecked() {
    //console.log('params', this.router.url);
    if (!this.router.url.includes('section')) {
      this.router.navigateByUrl('/profile/(section:personal-details)');
    }
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
    });
  }

}
