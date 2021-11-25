import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  updateNavbarEvent = new EventEmitter();
  updateNavbarUserContext = new EventEmitter();
  showOverlayEvent = new EventEmitter();
  subscription: Subscription;

  constructor() { }

  updateNavbarStatus(action) {
    this.updateNavbarEvent.emit(action);
  }

  updateNavbarUser(username) {
    this.updateNavbarUserContext.emit(username);
  }

  showOverlay(content) {
    this.showOverlayEvent.emit(content);
  }

}
