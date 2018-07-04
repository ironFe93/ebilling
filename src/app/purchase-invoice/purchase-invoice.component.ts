import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PurchaseService } from '../purchase.service';
import { Product } from '../models/product';

import { Observable ,  Subscription } from 'rxjs';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.css']
})
export class PurchaseInvoiceComponent implements OnInit {

  invoice$ = this.purchaseService.getInvoiceAsObservable();
  form: FormGroup;

  constructor(private purchaseService: PurchaseService,
    private router: Router, private fb: FormBuilder) {
      this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.fb.group({
      provider: ['', Validators.required],
      ruc: ['', Validators.required]
    });
  }

  removeFromInvoice(productId: any) {
    this.purchaseService.removeItem(productId);
  }

  onSubmit() {
    const provider = this.form.get('provider').value;
    const ruc = this.form.get('ruc').value;
    console.log('testing');
    this.purchaseService.registerInvoice(provider, ruc).subscribe();
  }


}
