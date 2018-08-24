import { Injectable } from '@angular/core';

import { Product } from './models/product';

import { BehaviorSubject, of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '../environments/environment';

@Injectable()
export class ProductsService {

  private productsUrl =  environment.apiUrl + '/api/product';

  private subjectProduct = new BehaviorSubject<Product>(new Product());

  constructor(private http: HttpClient, private messageService: MessageService, private eh: ErrorHandlerService) {
  }

  getProductObservable() {
    return this.subjectProduct.asObservable();
  }

  // Get all products from the API
  getAllProducts() {
    return this.http.get<Product[]>(this.productsUrl + '/findall');
  }

  // Get all products from the API
  getCategories() {
    return this.http.get<any[]>(this.productsUrl + '/categories');
  }

  // Get all products by search terms: simple search using defined indexes
  getByTerms(term: string) {

    const options = term ?
   { params: new HttpParams().set('term', term) } : {};

    return this.http.get<Product[]>(this.productsUrl + '/find', options)
      .pipe(
        catchError(err => throwError('something went wrong'))
      );

  }

  // Get one fully detailed product
  getProductDetail(id: any) {
    return this.http.get<Product>(this.productsUrl + '/getDetails/' + id)
      .pipe(tap(product => this.subjectProduct.next(product)));
  }

  createProduct(product: Product) {

    return this.http.post<Product>(
      this.productsUrl + '/create',
      product
    ).pipe(tap(x => this.messageService.add('Producto creado: ' + x.cod + ' ' + x.descripcion)));
  }

}
