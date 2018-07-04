import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private messageService: MessageService) { }

  public handleHttpErrorResponse(error: any) {
    this.messageService.add(error.error);
  }
}
