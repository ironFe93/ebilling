import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Bill } from './models/bill';
import { Product } from './models/product';

import { MessageService } from './message.service';

import { Observable, Observer, BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';


@Injectable()
export class SalesService {

  private cartsUrl = '/api/cart';

  private cart$ = new BehaviorSubject(new Bill); // a sale in process
  private sale$ = new BehaviorSubject(new Bill); // a completed sale

  constructor(private http: HttpClient,
    private messageService: MessageService, public snackbar: MatSnackBar) {
  }

  public getObservableCart() {
    return this.cart$.asObservable();
  }

  public getObservableSale() {
    return this.sale$.asObservable();
  }

  public getSales(terms: string) {
    return this.http.get<Bill[]>(this.cartsUrl + '/get/' + terms)
      .pipe(tap(resp => {
        console.log(resp);
        if (resp.length === 0) this.messageService.add('No Results');
      }));
  }

  public getSaleDetail(id) {
    return this.http.get<Bill>(this.cartsUrl + '/getDetail/' + id)
      .pipe(tap(resp => {
        this.sale$.next(resp);
      }));
  }

  // add a new Cart to the server
  public createCart() {

    const newCart = new Bill;
    newCart.status = 'active';

    return this.http.post<Bill>(this.cartsUrl + '/create', newCart)
      .pipe(
        tap(resp => {
          this.cart$.next(resp);
          this.messageService.add('CartService: Shopping Cart ready');
        }),
/*        catchError(err => {
          this.retryCart();
          return of(err);
          }) */
      );
  }

  public addItem(product: Product, quantity: number) {
    const cart = this.cart$.getValue();
    const repeated = cart.items.find(item => product.sku === item.sku);

    if (repeated) {
      this.messageService.add('Cart Service: Item already exists in cart!');
      return of(this.cart$.getValue());
    } else {

      return this.http.put<Bill>(this.cartsUrl + '/add',
        {
          'sku': product.sku,
          'title': product.title,
          'quantity': quantity,
          'cartId': cart._id
        })
        .pipe(tap(resp => {
          resp.grossTotal = resp.items.reduce((prevVal, item) => prevVal + item.listPrice * item.qty, 0);
          resp.itemsTotal = resp.items.reduce((prevVal, item) => prevVal + item.qty, 0);
          this.cart$.next(resp);
        }));
    }
  }

  public deltaOne(productSku: any, operation: string) {

    return this.http.put<Bill>(this.cartsUrl + '/deltaOne',
      {
        'sku': productSku, 'cartId': this.cart$.getValue()._id, 'operation': operation
      }).pipe(tap(resp => {
        this.calculateGrossTotal(resp);
        this.calculateItemsTotal(resp);
      }));
  }

  public removeItem(productSku: any) {
    return this.http.put<Bill>(this.cartsUrl + '/remove',
      {
        'sku': productSku, 'cartId': this.cart$.getValue()._id
      }).pipe(tap(resp => {
        this.calculateGrossTotal(resp);
        this.calculateItemsTotal(resp);
      }));
  }

  public completeCartCheckout(ruc: string, rs: string) {

    return this.http.put<Bill>(this.cartsUrl + '/completeCheckout',
      {
        'cartId': this.cart$.getValue()._id,
        'ruc': ruc,
        'rs': rs
      }).pipe(tap(resp => {
        if (resp.status === 'complete') {
          this.messageService.add('Venta realizada exitosamente');
          // save received cart as Sale then emit to sale$
          this.sale$.next(resp);
          // prepare a new cart
          this.createCart().subscribe();
        }
      }));
  }

  public destroyCart() {
    return this.http.delete(this.cartsUrl + '/destroy/' + this.cart$.getValue()._id, );
  }

  public checkIfCartExists() {
    if (this.cart$.getValue()._id) return true;
    return false;
  }

  private calculateGrossTotal(cart: Bill) {
    cart.grossTotal = cart.items.reduce((prevVal, item) => prevVal + item.listPrice * item.qty, 0);
    this.cart$.next(cart);
  }

  private calculateItemsTotal(cart: Bill) {
    cart.itemsTotal = cart.items.reduce((prevVal, item) => prevVal + item.qty, 0);
    this.cart$.next(cart);
  }

  retryCart() {
    this.snackbar.open('Failed to create cart. Retry?', 'Retry')
      .onAction()
      .subscribe( () => {
        this.createCart().subscribe();
      });
  }


}
