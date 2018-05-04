import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  messageClass;
  message;
	username;
  email;
  loginRecords;

  constructor(
  	private authService: AuthService,
    private router: Router
  ) { }

  getLoginRecords() {
    this.authService.getLoginStatus().subscribe(records => {
        if(records.success){
          this.loginRecords = records.records[0].record;
        }
      })
  }

  ngOnInit() {
  	this.authService.getProfile().subscribe(profile => {
      if(!profile.success){
        this.authService.logout();
        window.location.reload();
      } else {
        this.username = profile.user.username;
        this.email = profile.user.email;
      }

      this.getLoginRecords();
  	});
  }

}
