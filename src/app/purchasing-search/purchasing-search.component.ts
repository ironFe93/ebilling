import { Component, OnInit, Input } from '@angular/core';
import { PurchaseInvoice } from '../models/purchase-invoice';
import { PurchaseService } from '../purchase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-purchasing-search',
  templateUrl: './purchasing-search.component.html',
  styleUrls: ['./purchasing-search.component.css']
})
export class PurchasingSearchComponent {

  invoices: PurchaseInvoice[];
  form: FormGroup;

  constructor(private purchaseService: PurchaseService, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      string: ['', Validators.required],
      provider: ['', Validators.required],
      date1: [''],
      date2: [''],
      status: ['open', Validators.required],
    });
  }

  onSubmit(value: string) {
    this.purchaseService.findInvoices(this.form.value).subscribe(invoices => {
      this.invoices = invoices;
    });
  }

}
