import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgZone } from "@angular/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
  	private authService: AuthService,
  	private router: Router,
  	private flashMessagesService: FlashMessagesService,
    private zone: NgZone
  ) { }

  onLogoutClick() {
  	this.authService.logout();
  	this.flashMessagesService.show('logged out', { cssClass: 'alert-info', timeout: 2000});
  	//this.router.navigate([this.router.url]);
    this.zone.runOutsideAngular(() => {
      location.reload();
    });
  }

  ngOnInit() {
  }

}
