import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class SocketioService {

  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io();
    console.log('socket service');
    this.socket.on('message', (data) => {
      console.log('Hi! ' + data);
    });
  }

  public getMessages$(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  public getDashMsgs$(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('dashboard', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
}
