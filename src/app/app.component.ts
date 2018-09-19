import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  authorized = false;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.authorized = this.auth.loggedIn();
  }

}
