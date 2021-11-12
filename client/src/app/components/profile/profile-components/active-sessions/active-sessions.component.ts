import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth.service'

@Component({
  selector: 'app-active-sessions',
  templateUrl: './active-sessions.component.html',
  styleUrls: ['./active-sessions.component.css']
})
export class ActiveSessionsComponent implements OnInit {

  activeSessions;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getActiveSessions();
  }

  getActiveSessions() {
    this.authService.getActiveSessions().subscribe((data: any) => {
      if (data.success) {
        this.activeSessions = data.records;
      }
    })
  }

}
