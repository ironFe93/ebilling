import { Component, OnInit } from '@angular/core';
import {ProductsService} from '../products.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  products: any = []; //we pass this to the child

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
