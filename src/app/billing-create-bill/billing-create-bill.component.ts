import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { BillsService } from '../billing.service';

import { MatDialog } from '@angular/material/dialog';
import { Product } from '../models/product';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ProductsService } from '../products.service';

import { MatAutocompleteSelectedEvent, MatTableDataSource } from '@angular/material';
import { Item } from '../models/item';

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
    'descripcion', 'precio_unit', 'afectacion', 'valor_v', 'valor_v_total'];
  dataSource = new MatTableDataSource<Item>();

  billForm: FormGroup;
  bill$ =  this.billsService.getObservableBill();

  constructor(private billsService: BillsService, private productsService: ProductsService,
    private changeDet: ChangeDetectorRef, public dialog: MatDialog, private fb: FormBuilder) {
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
  }

  buildBillForm() {
    this.billForm = this.fb.group({
      ruc: '',
      razonSocial: '',
      fecha_v: '',
      fecha_e: new Date(),
      moneda: 'PEN',
      descuento_global: 0
    });
  }

  onSubmit() {
    this.billsService.composeBillDraft(this.billForm.value, this.dataSource.data);
    this.billsService.saveBillDraft().subscribe();
  }

}
