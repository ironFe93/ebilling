import { Injectable } from '@angular/core';

import { Product } from './models/product';
import { ProductReq } from './models/product-req';

import { Observable , BehaviorSubject ,  of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable()
export class ProductsService {

  private productsUrl = '/api/product';
  // -----For creating new Reqs----------
  private productReq: ProductReq = new ProductReq();
  private subjectProdReq = new BehaviorSubject(this.productReq);
  // ------------------------------------
  // -----For displaying new Reqs----------
  // private reqDetail: ProductReq = new ProductReq();
  private subjectReqDetail = new BehaviorSubject(new ProductReq());
  // ------------------------------------

  private subjectProduct: BehaviorSubject<Product> = new BehaviorSubject<Product>(new Product());

  constructor(private http: HttpClient, private messageService: MessageService) {
    this.productReq.items = []; // otherwise .items is undefined
  }

  getProductObservable() {
    return this.subjectProduct.asObservable();
  }

  getProductReqAsObservable() {
    return this.subjectProdReq.asObservable();
  }

  // Get all products from the API
  getAllProducts() {
    return this.http.get<Product[]>(this.productsUrl + '/findall');
  }

  // Get all products by search terms: simple search using defined indexes
  getByTerms(terms) {
    return this.http.get<Product[]>(this.productsUrl + '/find/' + terms);
  }

  // Get all product Details
  getProductDetail(id: any) {
    return this.http.get<Product>(this.productsUrl + '/getDetails/' + id)
      .pipe(tap(product => this.subjectProduct.next(product)));
  }

  createProduct(product: Product) {

    return this.http.post<Product>(
      this.productsUrl + '/create',
      product
    );
  }

  addToReq = (product: Product, quantity: Number) => {
    const repeated = this.productReq.items.find(item => product.sku === item.sku);
    if (repeated) {
      this.messageService.add('Purchase Service: Item already exists in order!');
      return of(this.productReq);
    } else {
      const item = {'sku': product.sku, 'qty': quantity, 'title': product.title, 'status': 'pending'};
      this.productReq.items.push(item);
      this.subjectProdReq.next(this.productReq);
    }
  }

  removeFromReq = (sku: String) => {
    const isProduct = (item) => item.sku !== sku;
    const modifiedItems = this.productReq.items.filter(isProduct);
    this.productReq.items = modifiedItems;
    this.subjectProdReq.next(this.productReq);
  }

  registerReq = () => {
    return this.http.post<ProductReq>(
      this.productsUrl + '/registerReq',
      this.productReq
    );
  }

  findReqs(queryObject) {
    let queryString = new HttpParams();

    const string = queryObject.string;
    const sku = queryObject.sku;
    const date1 = queryObject.date1;
    const date2 = queryObject.date2;
    const status = queryObject.status;

    console.log(date1);

    if (string) queryString = queryString.append('string', string);
    if (sku) queryString = queryString.append('sku', sku);
    if (date1) queryString = queryString.append('date1', date1);
    if (date2) queryString = queryString.append('date2', date2);
    if (status) queryString = queryString.append('status', status);

    return this.http.get<ProductReq[]>(this.productsUrl + '/findReq', { params: queryString });
  }

  /// Get fully detailed Requisition
  getReqDetail(id: String) {
    return this.http.get<ProductReq>(this.productsUrl + '/getReqDetail/' + id)
      .pipe(tap(req => {
        // this.reqDetail = req;
        this.subjectReqDetail.next(req);
      }));
  }

  getReqDetailAsObservable() {
    return this.subjectReqDetail.asObservable();
  }
}
