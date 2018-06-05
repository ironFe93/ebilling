import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {DashboardService} from '../dashboard.service';
import {Dashboard} from '../models/dashboard';
import {DashProdDialogComponent} from './dash-prod-dialog/dash-prod-dialog.component';

import {MatDialog} from '@angular/material';
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
    private productsService: ProductsService, public dialog: MatDialog) {
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

  addToReq(id, qty) {
    return null;
  }

  openDialog(id): void {
    let qty: number;
    const dialogRef = this.dialog.open(DashProdDialogComponent, {
      width: '250px',
      data: {qty: 1}
    });

    // listen to what happens on dialog close
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      qty = result;

      // if qty is not empty
      if (qty) {
        // getProduct then add it to a req along with qty
        this.productsService.getProductDetail(id).subscribe(
          x => this.productsService.addToReq(x, qty)
        );
      }
    });
  }
}
