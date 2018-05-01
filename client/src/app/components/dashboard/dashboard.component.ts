import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
  	private authService: AuthService
  ) { }

  ngOnInit() {
  	this.authService.getProfile().subscribe(profile => {
      if(!profile.success){
        this.authService.logout();
        window.location.reload();
      }
    });
  }

}
