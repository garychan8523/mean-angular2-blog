import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth.service'

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active-sessions',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './active-sessions.component.html',
  styleUrls: ['./active-sessions.component.css']
})
export class ActiveSessionsComponent implements OnInit {

  loading;
  activeSessions;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getActiveSessions();
  }

  getActiveSessions() {
    this.loading = true;
    this.authService.getActiveSessions().subscribe((data: any) => {
      if (data.success) {
        this.activeSessions = data.records;
        this.loading = false;
      }
    })
    setTimeout(() => { this.loading = false; }, 5000);
  }

}
