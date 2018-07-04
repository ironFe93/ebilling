import { Component, OnInit } from '@angular/core';

import {SalesService} from '../sales.service';
import {Sale} from '../models/cart';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.css']
})
export class SalesSearchComponent implements OnInit {

  // a sale is a shopping cart with status = complete;
  sales: Sale[];

  constructor(private ShoppingCartService: SalesService) {
  }

  ngOnInit() {
  }

  onEnter(value: string) {
    this.ShoppingCartService.getSales(value).subscribe(sales => {
      this.sales = sales;
    });
  }

}
