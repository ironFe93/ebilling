import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { environment } from '../environments/environment';

@Injectable()
export class AuthService {

  private authUrl = environment.apiUrl + '/api/auth';

  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService,
    public messageService: MessageService) {
    console.log(this.jwtHelper.isTokenExpired());
    console.log(this.jwtHelper.getTokenExpirationDate());
  }

  public loggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  // Login
  public login(username: String, password: String) {

    return this.http.post<any>(
      this.authUrl + '/login',
      { username: username, password: password }
    ).pipe(tap(res => {
      if (res.message === 'ok') {
        localStorage.setItem('token', res.token);
      }
    }));
  }

  test() {
    return this.http.post<any>(
      '/api/soap/test',
      { test: 'test data'}
    ).pipe(tap(
      x => console.log(x)
    ));
  }

}



