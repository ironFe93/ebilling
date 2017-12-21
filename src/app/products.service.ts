import { Injectable } from '@angular/core';

import { Product } from './models/product';

import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductsService {

  private productsUrl = "/api/product"

  constructor(private http: HttpClient) { }
  
    // Get all products from the API
    getAllProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.productsUrl + '/findall');
    }

    // Get all products from the API
    getBySKU(terms) {
      return this.http.get<Product[]>(this.productsUrl + '/findsku/'+terms);
    }

}
