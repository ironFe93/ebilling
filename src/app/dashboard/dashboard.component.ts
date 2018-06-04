import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {DashboardService} from '../dashboard.service';
import {Dashboard} from '../models/dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  productsDash$: Observable<Dashboard[]>;
  reqsDash$: Observable<Dashboard[]>;
  pOrdersDash$: Observable<Dashboard[]>;

  constructor(private dashboardService: DashboardService) {
   }

  ngOnInit() {
    this.productsDash$ = this.dashboardService.getProductDashAs$();
    this.reqsDash$ = this.dashboardService.getReqDashAs$();
    this.pOrdersDash$ = this.dashboardService.getOrderDashAs$();
  }

}
