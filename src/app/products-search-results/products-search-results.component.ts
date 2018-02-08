import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../models/product';
import { ShoppingCartService } from '../shopping-cart.service';
import { ProductsService } from '../products.service';



@Component({
  selector: 'app-products-search-results',
  templateUrl: './products-search-results.component.html',
  styleUrls: ['./products-search-results.component.css']
})
export class ProductsSearchResultsComponent implements OnInit {

  constructor(private cartService: ShoppingCartService,
    private productsService: ProductsService,
    private router: Router) { }

  // instantiate posts to an empty array
  @Input() products: any = [];
  terms: String;

  ngOnInit() {
  }

  routeFunctions(product, quantity){
    console.log(this.router.url);
    if (this.router.url == '/sales'){
      this.addProductToCart(product, quantity);
    }else if(this.router.url == '/products'){
      this.displayProductDetails(product._id);
    }
  }

  addProductToCart(product: Product, quantity: number) {
    this.cartService.addItem(product, quantity).subscribe();
  }

  displayProductDetails(id) {
    this.productsService.getProductDetail(id).subscribe();
  }
}