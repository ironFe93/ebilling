import { Injectable } from '@angular/core';

import { Cart } from './models/cart';
import { Product } from './models/product';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ShoppingCartService {

  private cartsUrl = "/api/cart";
  private cartId;

  private observableCart: Observable<Cart>;

  constructor(private http: HttpClient) {

  }

  //add a new Cart to the server
  public createCart() {

    //create a new Cart
    const newCart = new Cart;
    newCart.status = "active";

    //post the new cart to the DB, then the resulting observable<Cart>,
    // put it into this.observableCart and return it
    return this.observableCart = this.http.post<Cart>(this.cartsUrl + '/create', newCart)
          .pipe(tap(cart => this.cartId = cart._id));


    //https://stackoverflow.com/questions/41554156/angular-2-cache-observable-http-result-data
  }

  public get() {
    return this.observableCart
  }

  public addItem(product: Product, quantity: number) {


    return this.observableCart = this.http.put<Cart>(this.cartsUrl + '/add',
      {
        'sku': product.sku,
        'title': product.title,
        'quantity': quantity,
        'cartId': this.cartId,
      });

  }

  public removeItem(product: Product, quantity: number) {

    return this.http.put<Cart>(this.cartsUrl + '/remove',
      {
        'product': product, 'quantity': quantity,
        headers: new HttpHeaders().set('Authorization', 'some-token')
      });
  }

  public destroyCart(cartId) {
    return this.http.delete(this.cartsUrl + '/destroy' + '/' + cartId);
  }


}
