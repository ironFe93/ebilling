import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Bill } from './models/bill';
import { InvoiceLine } from './models/invoiceLine';
import { Product } from './models/product';

import { MessageService } from './message.service';

import { Observable, Observer, BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable()
export class BillsService {

  private BillsUrl = environment.apiUrl + '/api/bill';
  private bill$ = new BehaviorSubject(new Bill());
  private billDetail$ = new BehaviorSubject(new Bill());
  public billStepper = new BehaviorSubject(0);

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
    if (id === this.bill$.getValue()._id) {
      this.messageService.add('El documento ' + this.bill$.getValue().ID + ' está siendo creado o modificado');
      return this.billDetail$;
    }else {
      return this.http.get<Bill>(this.BillsUrl + '/getDetail/' + id)
      .pipe(tap(resp => {
        this.billDetail$.next(resp);
      }));
    }

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
        unitCode: product.cod_medida,
        val: 0
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
      _id: this.bill$.getValue()._id,
      ID: this.bill$.getValue().ID,
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
      InvoiceLine: invoiceLine,
      Status: {
        Draft: true,
        Rejected: false
      }
    };

    this.bill$.next(bill);
  }

  public saveBillDraft() {
    console.log(this.bill$.getValue().ID);
    return this.http.post<any>(this.BillsUrl + '/saveDraft',
      this.bill$.getValue()
    ).pipe(
      tap(resp => {
        if (resp) {
          this.messageService.add('Borrador factura creado: ' + resp.ID);
          this.bill$.next(resp);
        }
      }),
      catchError((err: HttpErrorResponse, caught) => {
        this.messageService.add(err.message);
        return of(err);
      })
    );
  }

  public sendSunat(id: String) {
    return this.http.post<any>(this.BillsUrl + '/sendSunat', {id: id})
    .pipe(tap(bill => {
      this.messageService.add(bill.Status.Description);
      this.bill$.next(bill);
      this.billDetail$.next(bill);
    }),
    catchError((err: HttpErrorResponse, caught) => {
      this.messageService.add(err.message);
      return of(err);
    }));
  }

  public getPDF(_id: string) {
    const options = _id ?
      { params: new HttpParams().set('_id', _id) } : {};

    return this.http.get<any>(this.BillsUrl + '/download', options);
  }

  clear() {
    this.bill$.next(new Bill());
  }

  validateLines(): boolean {
    let valid = true;
    const lines = this.bill$.getValue().InvoiceLine;
    if (lines.length === 0) {
      this.messageService.add('Debe ingresar al menos un Producto');
      valid = false;
    }
    lines.forEach(line => {
      if (!line.Item.Description) {
        this.messageService.add('Item no puede estar vacío');
        valid = false;
      }
      if (line.InvoicedQuantity.val <= 0) {
        this.messageService.add('Ingrese una cantidad válida');
        valid = false;
      }
      if (line.PricingReference.AlternativeConditionPrice.PriceAmount <= 0) {
        this.messageService.add('Ingrese un precio válido');
        valid = false;
      }
    });
    return valid;
  }
}
