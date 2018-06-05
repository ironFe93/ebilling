import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {DashboardService} from '../dashboard.service';
import {Dashboard} from '../models/dashboard';

import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ProductDetailsComponent} from '../product-details/product-details.component';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  productsDash$: Observable<Dashboard[]>;
  reqsDash$: Observable<Dashboard[]>;
  pOrdersDash$: Observable<Dashboard[]>;

  constructor(private dashboardService: DashboardService, private bottomSheet: MatBottomSheet,
    private productsService: ProductsService) {
   }

  ngOnInit() {
    this.productsDash$ = this.dashboardService.getProductDashAs$();
    this.reqsDash$ = this.dashboardService.getReqDashAs$();
    this.pOrdersDash$ = this.dashboardService.getOrderDashAs$();
  }

  viewProdDetail(id) {
    this.productsService.getProductDetail(id).subscribe();
    this.bottomSheet.open(ProductDetailsComponent);
  }

}
