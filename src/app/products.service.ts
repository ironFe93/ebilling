import { Injectable } from '@angular/core';

import { Product } from './models/product';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class ProductsService {

  constructor(private http: HttpClient) {
  }

  private productsUrl = "/api/product";

  private subjectProduct: BehaviorSubject<Product> = new BehaviorSubject<Product>(new Product());

  getProductObservable(){
    return this.subjectProduct.asObservable();
  }

  // Get all products from the API
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl + '/findall');
  }

  // Get all products by search terms: simple search using defined indexes
  getByTerms(terms) {
    return this.http.get<Product[]>(this.productsUrl + '/find/' + terms);
  }

  // Get all product Details
  getProductDetail(id: any) {
    return this.http.get<Product>(this.productsUrl + '/getDetails/' + id)
    .pipe(tap( product => this.subjectProduct.next(product)));
  }

  // Get all products from the API
  createProduct(product: Product) {

    return this.http.post<Product>(
      this.productsUrl + '/create',
      product,
      {headers: new HttpHeaders().set('Authorization', 'my-auth-token')}
    );
  }

}
