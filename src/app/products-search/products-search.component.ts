import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {ProductsService} from '../products.service';
import {Product} from '../models/product';


@Component({
  selector: 'app-products-search',
  templateUrl: './products-search.component.html',
  styleUrls: ['./products-search.component.css']
})
export class ProductsSearchComponent implements OnInit {

  products: Product[];
  @Input() selectedTab: number;

  constructor(private productsService: ProductsService) {
  }

  ngOnInit() {
  }

  onEnter(value: string) {
    // Retrieve posts from the API
    this.productsService.getByTerms(value).subscribe(products => {
      this.products = products;
    });
  }

}
