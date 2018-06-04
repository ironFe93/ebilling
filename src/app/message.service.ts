import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';



@Injectable()
export class MessageService {

  constructor() { }

  private messages: string[] = [];

  private subjectMessages = new BehaviorSubject(this.messages);
  messages$ = this.subjectMessages.asObservable();

  add(message: string) {
    this.messages.push(message); // save your data
    this.subjectMessages.next(this.messages); // emit your data
  }

  clear() {
    this.messages = [];
    this.subjectMessages.next(this.messages);
  }

}
