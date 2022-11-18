import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { NgZone } from "@angular/core";

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  mobile;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private zone: NgZone
  ) {
  }

  // ngAfterViewChecked() {
  //   //console.log('params', this.router.url);
  //   if (!this.router.url.includes('section')) {
  //     this.router.navigateByUrl('/settings/(section:personal-details)');
  //   }
  // }

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

  onLogoutClick() {
    this.authService.logout();
    this.flashMessagesService.show('logged out', { cssClass: 'alert-info', timeout: 2000 });
    //this.router.navigate([this.router.url]);
    this.zone.runOutsideAngular(() => {
      location.reload();
    });
  }

}
