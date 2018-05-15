import { Injectable } from '@angular/core';

import { PurchaseOrder } from './models/purchase-order';
import { Product } from './models/product';

import { MessageService } from './message.service';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';

import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class PurchaseService {

  private purchasingUrl = "/api/purchase";

  private pOrder: PurchaseOrder = new PurchaseOrder();
  private subjectPurchaseOrder = new BehaviorSubject(this.pOrder);

  private pOrderDetail: PurchaseOrder = new PurchaseOrder();
  private subjectPurchaseOrderDetail = new BehaviorSubject(this.pOrderDetail);

  constructor(private http: HttpClient,
    private messageService: MessageService) {
    this.pOrder.items = [];
  }

  public getObservablePurchaseOrder() {
    return this.subjectPurchaseOrder.asObservable();
  }

  public getObservablePODetail() {
    return this.subjectPurchaseOrderDetail.asObservable();
  }

  public clearPO() {
    this.pOrder = new PurchaseOrder();
    this.subjectPurchaseOrder.next(this.pOrder);
  }

  public addItemsFromReq(items: any) {
    this.pOrder.items = items;
    this.subjectPurchaseOrder.next(this.pOrder);
  }

  public addToPO(product: Product, quantity: number) {

    const repeated = this.pOrder.items.find(item => product.sku == item.sku);

    if (repeated) {
      this.messageService.add("Purchase Service: Item already exists in order!");
      return of(this.pOrder);
    } else {
      const item = { 'sku': product.sku, 'qty': quantity, 'title': product.title }
      this.pOrder.items.push(item);
      this.subjectPurchaseOrder.next(this.pOrder);
    }
  }

  public removeItem(sku: any) {
    var isProduct = (item) => item.sku !== sku
    var modifiedItems = this.pOrder.items.filter(isProduct);
    this.pOrder.items = modifiedItems;
    this.subjectPurchaseOrder.next(this.pOrder);
  }

  public registerPurchaseOrder(provider: String) {
    this.pOrder.provider = provider;
    this.subjectPurchaseOrder.next(this.pOrder);
    return this.http.post<PurchaseOrder>(this.purchasingUrl + '/registerPurchaseOrder', this.pOrder,
    ).pipe(tap(pOrder => {
      if (pOrder) {
        this.log("Orden de Compra registrada exitosamente");
        this.pOrder = null;
        this.subjectPurchaseOrder.next(this.pOrder);
        this.subjectPurchaseOrderDetail.next(pOrder);
      }
    }));
  }

  findPOrders(queryObject): Observable<PurchaseOrder[]> {
    var queryString = new HttpParams();

    const string = queryObject.string;
    const provider = queryObject.provider;
    const sku = queryObject.sku;
    const datePlaced1 = queryObject.datePlaced1;
    const datePlaced2 = queryObject.datePlaced2;
    const dateSent1 = queryObject.dateSent1;
    const dateSent2 = queryObject.dateSent2;
    const status = queryObject.status;

    if (string) queryString = queryString.append('string', string);
    if (provider) queryString = queryString.append('provider', provider);
    if (sku) queryString = queryString.append('sku', sku);
    if (datePlaced1) queryString = queryString.append('datePlaced1', datePlaced1);
    if (datePlaced2) queryString = queryString.append('datePlaced2', datePlaced2);
    if (dateSent1) queryString = queryString.append('dateSent1', dateSent1);
    if (dateSent2) queryString = queryString.append('dateSent2', dateSent2);
    if (status) queryString = queryString.append('status', status);

    return this.http.get<PurchaseOrder[]>(this.purchasingUrl + '/findPO', { params: queryString });
  }

  ///Get fully detailed Requisition
  public getPOrderDetail(id: String) {
    return this.http.get<PurchaseOrder>(this.purchasingUrl + '/getPOrderDetail/' + id)
      .pipe(tap(pOrder => {
        //this.pOrderDetail = pOrder;
        this.subjectPurchaseOrderDetail.next(pOrder);
      }));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.error.message}`);
      if (error.error.message == "Cart is expired") {
        //this.createCart().subscribe();
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a Service message with the MessageService */
  private log(message: string) {
    this.messageService.add(" PurchasingService: " + message);
  }

}
