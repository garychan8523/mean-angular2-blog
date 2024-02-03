import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EventEmitterService } from '../../services/event-emitter.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dataRegister: any = {};

  constructor(
    public authService: AuthService,
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit() {
    this.eventEmitterService.updateNavbarStatus('show');
    this.authService.getProfile().subscribe(profile => {
      this.dataRegister = profile;
      if (!this.dataRegister.success) {
        this.authService.logout();
      }
    });

    let current_path = location.pathname;
    if (current_path == '/about' || current_path == '/privacy-policy') {
      this.eventEmitterService.showOverlay(current_path.slice(1));
    }

  }

}
