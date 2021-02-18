import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { EventEmitterService } from '../../services/event-emitter.service';
import { NgZone } from "@angular/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  displayNavbar = true;

  constructor(
    public authService: AuthService,
    private eventEmitterService: EventEmitterService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private zone: NgZone
  ) { }

  showNavBar() {
    this.displayNavbar = true;
  }

  hideNavBar() {
    this.displayNavbar = false;
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessagesService.show('logged out', { cssClass: 'alert-info', timeout: 2000 });
    //this.router.navigate([this.router.url]);
    this.zone.runOutsideAngular(() => {
      location.reload();
    });
  }

  isRootActive() {
    let current_path = location.pathname;
    if (current_path == '/') {
      return true;
    } else {
      return false;
    }
    //return this.router.isActive('/', true);
  }

  ngOnInit() {
    if (this.eventEmitterService.subscription == undefined) {
      this.eventEmitterService.subscription = this.eventEmitterService.updateNavbarEvent.subscribe((action) => {

        if (action == 'show') {
          this.showNavBar();
        }
        if (action == 'hide') {
          this.hideNavBar();
        }
      });
    }
  }

}
