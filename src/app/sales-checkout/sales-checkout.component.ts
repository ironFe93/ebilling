import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SalesService } from '../sales.service';
import { Sale } from '../models/cart';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-checkout',
  templateUrl: './sales-checkout.component.html',
  styleUrls: ['./sales-checkout.component.css']
})
export class SalesCheckoutComponent implements OnInit {

  observableCart: Observable<Sale>;
  change: Number = 0.00;

  constructor(private cartService: SalesService,
     private router: Router) { }

  ngOnInit() {
    this.observableCart = this.cartService.getObservableCart();
  }

  confirmPayment() {
    this.cartService.completeCartCheckout().subscribe();
    this.router.navigateByUrl('/sales');
  }

}
