import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: SocketIOClient.Socket;
  private _socket;

  constructor(
    private authService: AuthService
  ) {
    if (!this.socket) {
      this.authService.loadToken();
      if (this.authService.authToken) {
        this.socket = io(environment.apiUrl, {
          query: {
            token: this.authService.authToken
          }
        });
      } else {
        this.socket = io(environment.apiUrl);
      }
    }
  }

  on(eventName: any, callback: any) {
    if (this.socket) {
      this.socket.on(eventName, function (data: any) {
        callback(data);
      });
    }
  };

  emit(eventName: any, data: any) {
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  };

  // public testMessage(message): void {
  //   this.socket.emit('message', message);
  // }

  public updateSocketToken(): void {
    this.socket.emit('updateToken', this.authService.authToken);
  }

  public emitNotification(data): void {
    this.socket.emit('notification', data);
  }

  public actionOther(data): void {
    this.socket.emit('actionOther', data);
  }

}
