import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BillsService } from '../billing.service';

import { MatDialog } from '@angular/material/dialog';
import { Product } from '../models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, catchError } from 'rxjs/operators';
import { ProductsService } from '../products.service';

import { MatAutocompleteSelectedEvent, MatTableDataSource } from '@angular/material';
import { Item } from '../models/item';
import { MessageService } from '../message.service';
import {  of, Observable } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-billing-create-bill',
  templateUrl: './billing-create-bill.component.html',
  styleUrls: ['./billing-create-bill.component.css']
})
export class CreateBillComponent implements OnInit {

  filteredProducts: Product[] = [];
  prodForm: FormGroup;
  isLoading = false;

  displayedColumns = ['codigo', 'cantidad', 'medida',
    'descripcion', 'precio_unit', 'afectacion', 'IGV', 'sum IGV', 'valor_v', 'valor_v_total'];
  dataSource = new MatTableDataSource<Item>();

  private billForm: FormGroup;
  bill$ = this.billsService.getObservableBill();

  constructor(private billsService: BillsService, private productsService: ProductsService,
    private changeDet: ChangeDetectorRef, private messageService: MessageService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.buildProdForm();
    this.initProdForm();

    this.buildBillForm();

    this.bill$.subscribe(bill => {
      this.dataSource.data = bill.items;
      this.changeDet.detectChanges();
    });
  }

  removeFromCart(productId: any) {
    this.billsService.removeItem(productId);
  }

  buildProdForm() {
    this.prodForm = this.fb.group({
      userInput: ''
    });
  }

  initProdForm() {
    // Async Autocomplete setup
    this.prodForm
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.productsService.getByTerms(value)
          .pipe(
            finalize(() => this.isLoading = false),
        )
        )
      )
      .subscribe(products => this.filteredProducts = products);
  }

  displayFn(product: Product) {
    if (product) { return product.descripcion; }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    const product: Product = event.option.value;
    this.billsService.addItem(product);
    this.prodForm.get('userInput').setValue('');
  }

  buildBillForm() {
    this.billForm = this.fb.group({
      ruc: ['', Validators.required],
      razonSocial: ['', Validators.required],
      cond_pago: [30, Validators.required],
      fecha_e: [new Date(), Validators.required],
      moneda: ['PEN', Validators.required],
      descuento_global: [0, Validators.required]
    });
  }

  onSubmit(): Observable<any> {
    if (this.billForm.valid) {
      this.billsService.composeBillDraft(this.billForm.value, this.dataSource.data);
      return this.billsService.saveBillDraft();
    } else {
      this.messageService.add('invalid data');
      return of(new Error('invalid data'));
    }

  }

  getBillForm() {
    return this.billForm;
  }

}