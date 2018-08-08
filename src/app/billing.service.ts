import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Bill } from './models/bill';
import { Item } from './models/item';
import { Product } from './models/product';

import { MessageService } from './message.service';

import { Observable, Observer, BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable()
export class BillsService {


  private BillsUrl = environment.apiUrl + '/api/bill';

  private bill$ = new BehaviorSubject(new Bill);

  constructor(private http: HttpClient,
    private messageService: MessageService, public snackbar: MatSnackBar) {
  }

  public getObservableBill() {
    return this.bill$.asObservable();
  }

  public getBills(terms: string) {
    return this.http.get<Bill[]>(this.BillsUrl + '/get/' + terms)
      .pipe(tap(resp => {
        console.log(resp);
        if (resp.length === 0) this.messageService.add('No Results');
      }));
  }

  public getBillDetail(id) {
    return this.http.get<Bill>(this.BillsUrl + '/getDetail/' + id)
      .pipe(tap(resp => {
        this.bill$.next(resp);
      }));
  }

  public addItem(product: Product) {
    const item = this.productToItem(product);
    const repeated = this.bill$.getValue().items.find(x => x.cod === item.cod);

    if (repeated) {
      this.messageService.add('Item ya existe en la factura');
      // Make better!!
      // return of(this.pOrder);
    } else {
      const invoice = this.bill$.getValue();
      invoice.items.push(item);
      this.bill$.next(invoice);
    }
  }

  public removeItem(_id: String) {
    const bill = this.bill$.getValue();
    const isProduct = (item) => item._id !== _id;
    const modifiedItems = bill.items.filter(isProduct);

    bill.items = modifiedItems;
    this.bill$.next(bill);
  }

  composeBillDraft(formdata: any, items: Item[]) {
    const bill: Bill = {
      cliente: {
        ruc: formdata.ruc,
        registration_name: formdata.razonSocial
      },
      moneda: formdata.moneda,
      fecha_emision: formdata.fecha_e,
      items: items,
      descuento_global: {
        factor: formdata.descuento
      }
    };
    this.bill$.next(bill);
  }

  public saveBillDraft() {
    console.log(this.bill$.getValue());
    return this.http.post<Bill>(this.BillsUrl + '/saveDraft',
      this.bill$.getValue()
    ).pipe(tap(resp => {
      if (resp) {
        this.messageService.add('Borrador factura creado: ' + resp.cod);
        this.bill$.next(new Bill);
        this.bill$.next(resp);
      }
    }));
  }

  productToItem(product: Product): Item {
    const item: Item = {
      cantidad: 0,
      cod: product.cod,
      descripcion: product.descripcion,
      medida: product.cod_medida,
      precio_unitario: {
        monto: 0,
        type_code: 1
      },
      valor_ref_unitario: {
        monto: 0,
        type_code: 2
      },
      descuento: {
        factor: 0
      },
      IGV : {
        afectacion_tipo: 10
      },
      _id: product._id,
      tipo: 'Bien'
    };
    //
    return item;
  }


}
