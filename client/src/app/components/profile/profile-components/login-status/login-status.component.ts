import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth.service'

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-status',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  loginRecords;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getLoginRecords();
  }

  getLoginRecords() {
    this.authService.getLoginStatus().subscribe((data: any) => {
      if (data.success) {
        this.loginRecords = data.records;
      }
    })
  }

}
