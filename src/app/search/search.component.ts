import { Component, OnInit } from '@angular/core';

import {ProductsService} from '../products.service';
import {Product} from '../models/product';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  products: Product[];

  constructor(private productsService: ProductsService) { 
    
  }

  ngOnInit() {
  }
 
  onEnter(value: string) { 
    // Retrieve posts from the API
    this.productsService.getBySKU(value).subscribe(products => {
      this.products = products;
    });
  }

}
