import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(public snackBar: MatSnackBar,
    public messageService: MessageService) { }

  ngOnInit() {

    this.messageService.messages$.subscribe(
      arr => {
        if (arr.length) {
          this.openSnackBar(arr[arr.length - 1]);
        }
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', {duration: 1000});
    // To Do: Handle Dismiss
  }

}
