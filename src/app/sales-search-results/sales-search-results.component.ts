import { Component, OnInit, Input } from '@angular/core';

import {ShoppingCartService} from '../shopping-cart.service';
import {Cart} from '../models/cart';

import {tap } from 'rxjs/operators';

@Component({
  selector: 'app-sales-search-results',
  templateUrl: './sales-search-results.component.html',
  styleUrls: ['./sales-search-results.component.css']
})
export class SalesSearchResultsComponent implements OnInit {

  @Input() sales: any = [];
  //saleDetail : Cart;

  constructor(private ShoppingCartService: ShoppingCartService) { }

  ngOnInit() {
  }

  getCartDetails(cartId: any){
    this.ShoppingCartService.getCartDetail(cartId).subscribe();
  }

}
