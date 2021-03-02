import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  updateNavbarEvent = new EventEmitter();
  subscription: Subscription;

  constructor() { }

  updateNavbarStatus(action) {
    this.updateNavbarEvent.emit(action);
  }
}
