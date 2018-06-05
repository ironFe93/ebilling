import { Component, OnInit } from '@angular/core';

import { ShoppingCartService } from '../shopping-cart.service';
import { Cart } from '../models/cart';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-detail',
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.css']
})
export class SalesDetailComponent implements OnInit {

  sale: Observable<Cart>;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit() {
    this.sale = this.cartService.getObservableSale();
  }

}
