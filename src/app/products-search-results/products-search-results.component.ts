import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../models/product';
import { BillsService } from '../billing.service';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products-search-results',
  templateUrl: './products-search-results.component.html',
  styleUrls: ['./products-search-results.component.css']
})
export class ProductsSearchResultsComponent implements OnInit {

  constructor(private billService: BillsService,
    private productsService: ProductsService,
    private router: Router) { }

  // instantiate posts to an empty array
  @Input() products: any = [];
  terms: String;
  @Input() selectedTab: number;

  ngOnInit() {
  }

  routeFunctions(product: Product) {
    if (this.router.url === '/billing') {
    } else if (this.router.url === '/products') {
      this.displayProductDetails(product._id);
    }else if (this.router.url === '/purchasing') {
      // this.addProductToPurchaseInvoice(product, quantity);
    }
  }

  addProductToPurchaseInvoice(product: Product, quantity: number) {
  }

  displayProductDetails(id) {
    this.productsService.getProductDetail(id).subscribe();
  }
}
