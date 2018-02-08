import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ShoppingCartService } from '../shopping-cart.service';
import { Cart } from '../models/cart';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-sales-checkout',
  templateUrl: './sales-checkout.component.html',
  styleUrls: ['./sales-checkout.component.css']
})
export class SalesCheckoutComponent implements OnInit {

  observableCart: Observable<Cart>;
  change: number = 0.00;

  constructor(private cartService: ShoppingCartService,
     private router: Router) { }

  ngOnInit() {
    this.observableCart = this.cartService.getObservableCart();
  }

  confirmPayment(){
    this.cartService.completeCartCheckout().subscribe();
    this.router.navigateByUrl('/sales');
  }

}
