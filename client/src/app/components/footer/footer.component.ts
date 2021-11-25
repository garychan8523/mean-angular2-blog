import { Component, OnInit } from '@angular/core';

import { EventEmitterService } from '../../services/event-emitter.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit() {
  }

  showOverlay(type) {
    this.eventEmitterService.showOverlay(type);
  }

}
