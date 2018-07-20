import { Component, OnInit } from '@angular/core';

import {SalesService} from '../sales.service';
import {Bill} from '../models/bill';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.css']
})
export class SalesSearchComponent implements OnInit {

  // a sale is a shopping cart with status = complete;
  sales: Bill[];

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
