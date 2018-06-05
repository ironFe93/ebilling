import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ShoppingCartService } from '../shopping-cart.service';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { SalesCheckoutComponent } from '../sales-checkout/sales-checkout.component';

import { Observable ,  Subscription } from 'rxjs';

@Component({
  selector: 'app-sales-shopping-cart',
  templateUrl: './sales-shopping-cart.component.html',
  styleUrls: ['./sales-shopping-cart.component.css']
})
export class SalesShoppingCartComponent implements OnInit {

  observableCart: Observable<Cart>;
  cartSubscription: Subscription; // so we can unsub later.

  constructor(private cartService: ShoppingCartService,
    private router: Router) {

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
}
