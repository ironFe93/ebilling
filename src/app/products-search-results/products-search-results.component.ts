import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../models/product';
import { ShoppingCartService } from '../shopping-cart.service';


@Component({
  selector: 'app-products-search-results',
  templateUrl: './products-search-results.component.html',
  styleUrls: ['./products-search-results.component.css']
})
export class ProductsSearchResultsComponent implements OnInit {

  // instantiate posts to an empty array
  @Input() products: any = [];
  terms: String;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit() {

  }

  addProductToCart(product: Product, quantity: number) {

    console.log('qty: ' + quantity);

    this.cartService.addItem(product, quantity).subscribe();

  }
}