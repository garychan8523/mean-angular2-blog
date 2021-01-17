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
  dataRegister: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  getLoginRecords() {
    this.authService.getLoginStatus().subscribe(records => {
      this.dataRegister = records
      if (this.dataRegister.success) {
        this.loginRecords = this.dataRegister.records;
      }
    })
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.dataRegister = profile
      if (!this.dataRegister.success) {
        this.authService.logout();
        window.location.reload();
      } else {
        this.username = this.dataRegister.user.username;
        this.email = this.dataRegister.user.email;
      }

      this.getLoginRecords();
    });
  }

}
