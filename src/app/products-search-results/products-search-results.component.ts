import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../models/product';
import { SalesService } from '../sales.service';
import { ProductsService } from '../products.service';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-products-search-results',
  templateUrl: './products-search-results.component.html',
  styleUrls: ['./products-search-results.component.css']
})
export class ProductsSearchResultsComponent implements OnInit {

  constructor(private cartService: SalesService,
    private productsService: ProductsService,
    private purchaseService: PurchaseService,
    private router: Router) { }

  // instantiate posts to an empty array
  @Input() products: any = [];
  terms: String;
  @Input() selectedTab: number;

  ngOnInit() {
  }

  routeFunctions(product, quantity) {
    console.log(this.router.url);
    console.log(this.selectedTab);
    if (this.router.url === '/sales') {
      this.addProductToCart(product, quantity);
    } else if (this.router.url === '/products') {
      this.displayProductDetails(product._id);
    }else if (this.router.url === '/purchasing') {
      this.addProductToPurchaseInvoice(product, quantity);
    } else if (this.router.url === '/inventory') {
      this.addProductToProductReq(product, quantity);
    }
  }

  addProductToCart(product: Product, quantity: number) {
    this.cartService.addItem(product, quantity).subscribe();
  }

  addProductToPurchaseInvoice(product: Product, quantity: number) {
    this.purchaseService.addToInvoice(product, quantity);
  }

  displayProductDetails(id) {
    this.productsService.getProductDetail(id).subscribe();
  }

  addProductToProductReq(product: Product, quantity: number) {
    this.productsService.addToReq(product, quantity);
  }
}
