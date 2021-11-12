import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  socket: SocketIOClient.Socket;
  private _socket;

  constructor() {
    this.socket = io.connect(environment.apiUrl);
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

  public emitNotification(data): void {
    this.socket.emit('notification', data);
  }

  public actionOther(data): void {
    this.socket.emit('actionOther', data);
  }

}
