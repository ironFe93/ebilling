import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

import { MatSnackBar } from '@angular/material'
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
          this.openSnackBar(arr[arr.length - 1], "Dismiss")
        }
      });
  }

  openSnackBar(message: string, action: string) {
    console.log("opening snackbar...");
    this.snackBar.open(message, action, {
      //duration: 2000,
    });

    //To Do: Handle Dismiss
  }

}
