import { Injectable } from '@angular/core';

import { Cart } from './models/cart';
import { Product } from './models/product';

import { MessageService } from './message.service';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ShoppingCartService {

  private cartsUrl = "/api/cart";
  private cartId;
  private cart: Cart = new Cart();

  private subjectCart = new BehaviorSubject(this.cart);
  //https://stackoverflow.com/questions/42798236/angular2-how-to-update-an-item-inside-an-observable-collection

  constructor(private http: HttpClient,
    private messageService: MessageService) {

  }

  public getObservableCart() {
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
        this.messageService.add('CartService: Shopping Cart ready');
      }), catchError(this.handleError('createCart', [])));


    //https://stackoverflow.com/questions/41554156/angular-2-cache-observable-http-result-data
    //https://stackoverflow.com/questions/39494058/behaviorsubject-vs-observable
  }

  public addItem(product: Product, quantity: number) {

    var repeated = this.cart.items.find(item => product.sku == item.sku);

    if (repeated) {
      this.messageService.add("Cart Service: Item already exists in cart!");
      return of(this.cart);
    } else {
      
      //To Do: Handle Errors
      return this.http.put<Cart>(this.cartsUrl + '/add',
        {
          'sku': product.sku,
          'title': product.title,
          'quantity': quantity,
          'cartId': this.cart._id,
        })
        .pipe(tap(cart => {

          //this.subjectCart.next(Object.assign({}, this.cart)); // emit completely new value

          cart.grossTotal = cart.items.reduce((prevVal, item) => prevVal + item.listPrice * item.qty, 0);
          cart.itemsTotal = cart.items.reduce((prevVal, item) => prevVal + item.qty, 0);

          this.cart = cart; // save your data
          this.subjectCart.next(this.cart); // emit your data
        }));
    }
  }

  public removeOne(productId: any) {

    return this.http.put<Cart>(this.cartsUrl + '/removeOne',
      {
        'product': productId, 'cartId': this.cart._id,
        headers: new HttpHeaders().set('Authorization', 'some-token')
      });
  }

  public addOne(productId: any) {

    return this.http.put<Cart>(this.cartsUrl + '/addOne',
      {
        'product': productId, 'cartId': this.cart._id,
        headers: new HttpHeaders().set('Authorization', 'some-token')
      });
  }

  public removeItem(productId: any) {

    return this.http.put<Cart>(this.cartsUrl + '/remove',
      {
        'productId': productId, 'cartId': this.cart._id,
        headers: new HttpHeaders().set('Authorization', 'some-token')
      });
  }

  public destroyCart() {
    return this.http.delete(this.cartsUrl + '/destroy' + '/' + this.cart._id, );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(" HeroService: " + message);
  }

}
