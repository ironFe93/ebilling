// https://hackernoon.com/global-http-error-catching-in-angular-4-3-9e15cc1e0a6b

import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { tap, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(public errorHandler: ErrorHandlerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(tap((event: HttpEvent<any>) => { }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          this.errorHandler.handleHttpErrorResponse(err);
        }
      }));
  }
}
