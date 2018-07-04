import { Injectable } from '@angular/core';

import { PurchaseInvoice } from './models/purchase-invoice';
import { Product } from './models/product';

import { MessageService } from './message.service';

import { Observable, Observer, BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class PurchaseService {

  private purchasingUrl = '/api/purchase';

  private invoice$ = new BehaviorSubject(new PurchaseInvoice);
  private invoiceDetail$ = new BehaviorSubject(new PurchaseInvoice);

  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  public getInvoiceAsObservable() {
    return this.invoice$.asObservable();
  }

  public getInvoiceDetailAsObservable() {
    return this.invoiceDetail$.asObservable();
  }

  public clearInvoice() {
    this.invoice$.next(new PurchaseInvoice);
  }

  public addToInvoice(product: Product, quantity: number) {

    const repeated = this.invoice$.getValue().items.find(item => product.sku === item.sku);

    if (repeated) {
      this.messageService.add('Purchase Service: Item already exists in order!');
      // Make better!!
      // return of(this.pOrder);
    } else {
      const item = { 'sku': product.sku, 'qty': quantity, 'title': product.title };
      const invoice = this.invoice$.getValue();
      invoice.items.push(item);
      this.invoice$.next(invoice);
    }
  }

  public removeItem(sku: any) {
    const invoice = this.invoice$.getValue();
    const isProduct = (item) => item.sku !== sku;
    const modifiedItems = invoice.items.filter(isProduct);

    invoice.items = modifiedItems;
    this.invoice$.next(invoice);
  }

  public registerInvoice(provider: String, ruc: Number) {
    const invoice = this.invoice$.getValue();
    invoice.provider = provider;
    invoice.ruc = ruc;
    this.invoice$.next(invoice);
    return this.http.post<PurchaseInvoice>(this.purchasingUrl + '/registerInvoice',
      this.invoice$.getValue()
    ).pipe(tap(resp => {
      if (resp) {
        this.log('Factura/Boleta registrada exitosamente');
        this.invoice$.next(new PurchaseInvoice);
        this.invoiceDetail$.next(resp);
      }
    }));
  }

  findInvoices(queryObject): Observable<PurchaseInvoice[]> {
    let queryString = new HttpParams();

    const string = queryObject.string;
    const provider = queryObject.provider;
    const sku = queryObject.sku;
    const date1 = queryObject.datePlaced1;
    const date2 = queryObject.datePlaced2;
    const status = queryObject.status;

    if (string) queryString = queryString.append('string', string);
    if (provider) queryString = queryString.append('provider', provider);
    if (sku) queryString = queryString.append('sku', sku);
    if (date1) queryString = queryString.append('date1', date1);
    if (date2) queryString = queryString.append('date2', date2);
    if (status) queryString = queryString.append('status', status);

    return this.http.get<PurchaseInvoice[]>(this.purchasingUrl + '/findInvoice', { params: queryString });
  }

  /// Get fully detailed Invoice
  public getInvoiceDetail(id: String) {
    return this.http.get<PurchaseInvoice>(this.purchasingUrl + '/getInvoiceDetail/' + id)
      .pipe(tap(resp => {
        this.invoiceDetail$.next(resp);
      }));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.error.message}`);
      if (error.error.message === 'Cart is expired') {
        // this.createCart().subscribe();
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a Service message with the MessageService */
  private log(message: string) {
    this.messageService.add(' PurchasingService: ' + message);
  }

}
