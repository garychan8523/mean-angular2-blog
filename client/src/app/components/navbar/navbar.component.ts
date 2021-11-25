import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SocketService } from '../../services/socket.service';
import { EventEmitterService } from '../../services/event-emitter.service';
import { NgZone } from "@angular/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  notificationClass;
  notification = false;
  displayNavbar = true;
  username;

  constructor(
    public authService: AuthService,
    private router: Router,
    private socketService: SocketService,
    private eventEmitterService: EventEmitterService,
    private flashMessagesService: FlashMessagesService,
    private zone: NgZone
  ) { }

  showNavBar() {
    this.displayNavbar = true;
  }

  hideNavBar() {
    this.displayNavbar = false;
  }

  isRootActive() {
    let current_path = location.pathname;
    if (current_path == '/' || current_path == '/about' || current_path == '/privacy-policy') {
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

    this.eventEmitterService.updateNavbarUserContext.subscribe((username) => {
      this.username = username;
    });

    this.authService.getProfile().subscribe((data: any) => {
      if (data.success) {
        this.username = data.user.username;
      }
    });

    this.socketService.emitNotification({ msg: 'connected' });

    this.socketService.on('notification', data => {
      this.zone.run(() => {
        this.notificationClass = 'alert alert-info';
        this.notification = data.msg;

        window.setTimeout(() => {
          this.notification = false;
        }, 5000);
      });
    });

  }

}
