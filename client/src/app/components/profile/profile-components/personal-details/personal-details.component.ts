import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../services/auth.service'

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {

  username;
  email;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe((profile: any) => {
      if (!profile.success) {
        this.authService.logout();
        window.location.reload();
      } else {
        this.username = profile.user.username;
        this.email = profile.user.email;
      }

    });
  }

}
