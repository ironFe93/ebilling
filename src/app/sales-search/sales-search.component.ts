import { Component, OnInit } from '@angular/core';

import {ShoppingCartService} from '../shopping-cart.service';
import {Cart} from '../models/cart';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.css']
})
export class SalesSearchComponent implements OnInit {

  //a sale is a shopping cart with status = complete;
  sales: Cart[];

  constructor(private ShoppingCartService: ShoppingCartService) { 
    
  }

  ngOnInit() {
  }
 
  onEnter(value: string) { 
    // Retrieve posts from the API
    this.ShoppingCartService.getCarts(value).subscribe(sales => {
      this.sales = sales;
    });
  }

}
