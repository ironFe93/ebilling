import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SalesService } from '../sales.service';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import { Bill } from '../models/bill';

import {MatDialog } from '@angular/material';

import { Observable ,  Subscription } from 'rxjs';

@Component({
  selector: 'app-sales-shopping-cart',
  templateUrl: './sales-shopping-cart.component.html',
  styleUrls: ['./sales-shopping-cart.component.css']
})
export class SalesShoppingCartComponent implements OnInit {

  observableCart: Observable<Bill>;
  cartSubscription: Subscription; // so we can unsub later.

  constructor(private cartService: SalesService,
    private router: Router, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.observableCart = this.cartService.getObservableCart();
  }

  removeFromCart(productId: any) {
    this.cartService.removeItem(productId).subscribe();
  }

  deltaOne(productId: any, operation: string) {
    this.cartService.deltaOne(productId, operation).subscribe();
  }

  goToCheckout() {
    this.router.navigateByUrl('/sales-checkout');
  }

  openCheckoutDialog(ruc, rs) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { ruc: ruc, rs: rs }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
