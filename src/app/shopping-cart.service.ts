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


@Injectable()
export class ShoppingCartService {

  private cartsUrl = "/api/cart";
  private cartId;
  //represents the current ShoppingCart
  private cart: Cart = new Cart();
  //sale is a cart with status = complete
  //represents the current sale that has been queried.
  private sale: Cart = new Cart();

  private subjectCart = new BehaviorSubject(this.cart);
  //https://stackoverflow.com/questions/42798236/angular2-how-to-update-an-item-inside-an-observable-collection
  
  private subjectSale = new BehaviorSubject(this.cart);

  constructor(private http: HttpClient,
    private messageService: MessageService) {

  }

  public getCart() {
    return this.cart;
  }

  public getObservableCart() {
    return this.subjectCart.asObservable();
  }

  public getObservableSale() {
    return this.subjectSale.asObservable();
  }

  public getCarts(terms) {

    // put it into this.observableCart and return it
    return this.http.get<Cart[]>(this.cartsUrl + '/get/'+ terms,  {
      headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
    }).pipe(catchError(this.handleError('getCartDetail', [])));
  }

  public getCartDetail(id) {

    // put it into this.observableCart and return it
    return this.http.get<Cart>(this.cartsUrl + '/getDetail/'+ id,  {
      headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
    }).pipe(tap(cart => {
      this.sale = cart; // save your data
      this.subjectSale.next(this.sale); // emit your data
      
    }), catchError(this.handleError('getCartDetail', [])));
  }

  //add a new Cart to the server
  public createCart() {

    //create a new Cart
    const newCart = new Cart;
    newCart.status = "active";

    //post the new cart to the DB, then the resulting observable<Cart>,
    // put it into this.observableCart and return it
    return this.http.post<Cart>(this.cartsUrl + '/create', newCart,  {
      headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
    })
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
          'cartId': this.cart._id
        },  {
          headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
        })
        .pipe(tap(cart => {

          //this.subjectCart.next(Object.assign({}, this.cart)); // emit completely new value

          cart.grossTotal = cart.items.reduce((prevVal, item) => prevVal + item.listPrice * item.qty, 0);
          cart.itemsTotal = cart.items.reduce((prevVal, item) => prevVal + item.qty, 0);

          this.cart = cart; // save your data
          this.subjectCart.next(this.cart); // emit your data
        }), catchError(this.handleError('Add Product', [])));
    }
  }

  public deltaOne(productSku: any, operation: string) {

    return this.http.put<Cart>(this.cartsUrl + '/deltaOne',
      {
        'sku': productSku, 'cartId': this.cart._id, 'operation': operation
      }, {
        headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
      }).pipe(tap(cart => {

        this.UpdateCartSubject(cart);
      }));
  }

  public removeItem(productSku: any) {

    return this.http.put<Cart>(this.cartsUrl + '/remove',
      {
        'sku': productSku, 'cartId': this.cart._id
      },  {
        headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
      }).pipe(tap(cart => {

        this.UpdateCartSubject(cart);
      }));
  }

  public completeCartCheckout() {

    return this.http.put<Cart>(this.cartsUrl + '/completeCheckout',
      {
        'cartId': this.cart._id
      },  {
        headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
      }).pipe(tap(cart => {
        if (cart.status == "complete"){
          this.log("Venta realizada exitosamente");
          //clear the Cart and CartObservable
          this.cart = new Cart();
          this.subjectCart.next(this.cart);
          // save received cart as Sale then emit to SaleSubject
          this.sale = cart; 
          this.subjectSale.next(this.sale); 
        }
      }));
  }

  public destroyCart() {
    return this.http.delete(this.cartsUrl + '/destroy' + '/' + this.cart._id, );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.error.message}`);
      if(error.error.message == "Cart is expired"){
        this.createCart().subscribe();
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a Service message with the MessageService */
  private log(message: string) {
    this.messageService.add(" CartService: " + message);
  }

  private UpdateCartSubject(cart: Cart) {
    cart.grossTotal = cart.items.reduce((prevVal, item) => prevVal + item.listPrice * item.qty, 0);
    cart.itemsTotal = cart.items.reduce((prevVal, item) => prevVal + item.qty, 0);

    this.cart = cart; // save your data
    this.subjectCart.next(this.cart); // emit your data
  }

}
