import { Injectable } from '@angular/core';

import { Cart } from './models/cart';
import { Product } from './models/product';

import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class ShoppingCartService {

  private cartsUrl = "/api/cart"
  private cartId;

  constructor(private http: HttpClient) { }

  //add a new Cart to the server
  public createCart() {

    const newCart = new Cart;
    newCart.status = "active"

    return this.http.post<Cart>(this.cartsUrl + '/create', newCart).pipe(
      tap((cart: Cart) => this.cartId = cart._id));      
  }

  public logger(){
    return this.cartId;
  }

  public addItem(product: Product, quantity: number) {

    return this.http.put<Cart>(this.cartsUrl + '/add',
      {
        'product': product, 'quantity': quantity, 'cartId': this.cartId,
        headers: new HttpHeaders().set('Authorization', 'some-token')
      })
  }

  public removeItem(product: Product, quantity: number) {

    return this.http.put<Cart>(this.cartsUrl + '/remove',
      {
        'product': product, 'quantity': quantity,
        headers: new HttpHeaders().set('Authorization', 'some-token')
      })
  }

  public destroyCart() {
    return this.http.delete(this.cartsUrl + '/destroy' + '/' + this.cartId);
  }
}
