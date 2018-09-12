import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Bill } from './models/bill';
import { InvoiceLine } from './models/invoiceLine';
import { Product } from './models/product';

import { MessageService } from './message.service';

import { Observable, Observer, BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable()
export class BillsService {

  private BillsUrl = environment.apiUrl + '/api/bill';
  private bill$ = new BehaviorSubject(new Bill());
  private billDetail$ = new BehaviorSubject(new Bill());

  constructor(private http: HttpClient,
    private messageService: MessageService, public snackbar: MatSnackBar) {
  }

  public getObservableBill() {
    return this.bill$.asObservable();
  }

  public getObservableDetailBill() {
    return this.billDetail$.asObservable();
  }

  // Get all bills by search terms
  getByTerms(term: string) {

    const options = term ?
      { params: new HttpParams().set('term', term) } : {};

    return this.http.get<Bill[]>(this.BillsUrl + '/find', options)
      .pipe(
        catchError(err => throwError('something went wrong'))
      );
  }

  public getBillDetail(id) {
    return this.http.get<Bill>(this.BillsUrl + '/getDetail/' + id)
      .pipe(tap(resp => {
        this.billDetail$.next(resp);
        console.log(this.billDetail$.value);
      }));
  }

  public addItem(product: Product) {
    const invoiceLine: InvoiceLine = {
      tipo: 'Producto',
      Item: {
        Description: product.descripcion,
        SellersItemIdentification: {
          ID: product.cod
        }
      },
      InvoicedQuantity : {
        unitCode: product.cod_medida
      },
      PricingReference: {
        AlternativeConditionPrice: {
          PriceAmount: 0,
          PriceTypeCode: '00'
        }
      },
      TaxTotal : {
        TaxAmount: 0,
        TaxSubtotal : {
          TaxableAmount: 0 ,
          TaxAmount: 0,
          TaxCategory : {
            TaxExemptionReasonCode: 10,
            Percent: 18
          }
        }
      },
      AllowanceCharge: {
        MultiplierFactorNumeric: 0,
        ChargeIndicator: false,
        AllowanceChargeReasonCode: '00'
      }
    };

    const repeated = this.bill$.getValue().InvoiceLine.find(line => {
      return line.Item.SellersItemIdentification.ID === invoiceLine.Item.SellersItemIdentification.ID;
    });

    if (repeated) {
      this.messageService.add('Item ya existe en la factura');
      // Make better!!
      // return of(this.pOrder);
    } else {
      const invoice = this.bill$.getValue();
      invoice.InvoiceLine.push(invoiceLine);
      this.bill$.next(invoice);
    }
  }

  public removeItem(id: String) {
    const bill = this.bill$.getValue();
    const isProduct = (line: InvoiceLine) => line.Item.SellersItemIdentification.ID !== id;
    const modifiedLines = bill.InvoiceLine.filter(isProduct);

    bill.InvoiceLine = modifiedLines;
    this.bill$.next(bill);
  }

  composeBillDraft(formdata: any, invoiceLine: InvoiceLine[]) {

    const bill: Bill = {
      InvoiceTypeCode: '01',
      IssueDate: formdata.fecha_e,
      AccountingCustomerParty: {
        PartyIdentification: {
          ID: formdata.ruc,
          schemeID: '6'
        },
        PartyLegalEntity: {
          RegistrationName: formdata.razonSocial
        }
      },
      cond_pago : formdata.cond_pago,
      DocumentCurrencyCode : formdata.moneda,
      AllowanceCharge: {
        AllowanceChargeReasonCode: '02',
        ChargeIndicator: false,
        MultiplierFactorNumeric: formdata.descuento_global
      },
      InvoiceLine: invoiceLine
    };

    this.bill$.next(bill);
  }

  public saveBillDraft() {
    return this.http.post<any>(this.BillsUrl + '/saveDraft',
      this.bill$.getValue()
    ).pipe(
      tap(resp => {
        if (resp) {
          this.messageService.add('Borrador factura creado: ' + resp.ID);
          this.billDetail$.next(resp);
          this.bill$.next(resp);
        }
      }),
      catchError((err, caught) => of(err))
    );
  }

  public sunat() {
    return this.http.post<any>(this.BillsUrl + '/sunat', this.bill$.getValue().ID);
  }

  public getPDF(_id: string) {
    const options = _id ?
      { params: new HttpParams().set('_id', _id) } : {};

    return this.http.get<any>(this.BillsUrl + '/download', options);
  }

  clear() {
    this.bill$.next(new Bill());
  }
}
