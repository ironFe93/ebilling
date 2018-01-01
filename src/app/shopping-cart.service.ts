import { Injectable } from '@angular/core';

import { Cart } from './models/cart';
import { Product } from './models/product';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ShoppingCartService {

  private cartsUrl = "/api/cart";
  private cartId;
  private cart: Cart = new Cart();

  private subjectCart = new BehaviorSubject(this.cart);
  //https://stackoverflow.com/questions/42798236/angular2-how-to-update-an-item-inside-an-observable-collection

  constructor(private http: HttpClient) {

  }

  public getObservableCart(){
    return this.subjectCart.asObservable();
  }

  //add a new Cart to the server
  public createCart() {

    //create a new Cart
    const newCart = new Cart;
    newCart.status = "active";

    //post the new cart to the DB, then the resulting observable<Cart>,
    // put it into this.observableCart and return it
    return this.http.post<Cart>(this.cartsUrl + '/create', newCart)
          .pipe(tap(cart => {
            this.cart = cart; // save your data
            this.subjectCart.next(this.cart); // emit your data
          }));


    //https://stackoverflow.com/questions/41554156/angular-2-cache-observable-http-result-data
  }

  public addItem(product: Product, quantity: number) {


    this.http.put<Cart>(this.cartsUrl + '/add',
      {
        'sku': product.sku,
        'title': product.title,
        'quantity': quantity,
        'cartId': this.cart._id,
      })
      .pipe(tap(cart => {
        
        //this.subjectCart.next(Object.assign({}, this.cart)); // emit completely new value
        
        cart.grossTotal = this.cart.grossTotal + 100;
        
        this.cart = cart; // save your data
        this.subjectCart.next(this.cart); // emit your data
      }));

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
