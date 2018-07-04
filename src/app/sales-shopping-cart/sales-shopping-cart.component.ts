import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SalesService } from '../sales.service';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import { Sale } from '../models/cart';
import { Product } from '../models/product';
import { SalesCheckoutComponent } from '../sales-checkout/sales-checkout.component';

import {MatDialog } from '@angular/material';

import { Observable ,  Subscription } from 'rxjs';

@Component({
  selector: 'app-sales-shopping-cart',
  templateUrl: './sales-shopping-cart.component.html',
  styleUrls: ['./sales-shopping-cart.component.css']
})
export class SalesShoppingCartComponent implements OnInit {

  observableCart: Observable<Sale>;
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

  openCheckoutDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
