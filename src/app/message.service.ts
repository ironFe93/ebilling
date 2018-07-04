import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { BehaviorSubject, Observable, of } from 'rxjs';



@Injectable()
export class MessageService {

  private messages: {message: string, action: string }[] = [];
  private messages$ = new BehaviorSubject(this.messages);

  constructor(public snackbar: MatSnackBar) {
    this.messages$.forEach( msgs => {
      if (msgs.length > 0) {
        this.openSnackbar(msgs[msgs.length - 1].message);
      }
    });
  }

  getMessagesAsObservable() {
    return this.messages$.asObservable();
  }

  add(message: string, action?: string) {
    this.messages.push({message, action}); // save your data
    this.messages$.next(this.messages); // emit your data
  }

  clear() {
    this.messages = [];
    this.messages$.next(this.messages);
  }

  public openSnackbar(msg: any) {
    this.snackbar.open(msg, 'close');
  }

}
