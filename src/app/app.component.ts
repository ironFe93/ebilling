import { Component } from '@angular/core';

import { AuthService } from './auth.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private auth: AuthService, private dashService: DashboardService) {}

}
