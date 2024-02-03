import { Component } from '@angular/core';
import { Location, ViewportScroller } from '@angular/common';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverlayComponent } from './components/overlay/overlay.component';
import { FlashMessagesModule } from './modules/flash-messages/module';
// import { FlashMessagesComponent } from './modules/flash-messages/flash-messages.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FlashMessagesModule,
    OverlayComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private loc: Location,
    private router: Router,
    private viewportScroller: ViewportScroller) {
    this.router.events.pipe(filter(e => e instanceof Scroll)).subscribe((e: any) => {
      console.log(e);

      // this is fix for dynamic generated(loaded..?) content
      setTimeout(() => {
        if (e.position) {
          this.viewportScroller.scrollToPosition(e.position);
        } else if (e.anchor) {
          this.viewportScroller.scrollToAnchor(e.anchor);
        } else {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      });
    });
  }

}
