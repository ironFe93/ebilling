import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../models/product';
import { ShoppingCartService } from '../shopping-cart.service';


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  // instantiate posts to an empty array
  @Input() products: any = [];
  terms: String;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit() {

  }

  addProductToCart(product: Product, quantity: number) {
    console.log("Inside AddProductToCart");
    this.cartService.addItem(product, quantity).subscribe();

  }
}