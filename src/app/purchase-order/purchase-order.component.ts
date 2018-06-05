import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PurchaseService } from '../purchase.service';
import { Product } from '../models/product';

import { Observable ,  Subscription } from 'rxjs';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

  observablePO = this.purchaseService.getObservablePurchaseOrder();
  pOForm: FormGroup;

  constructor(private purchaseService: PurchaseService, 
    private router: Router, private fb: FormBuilder) {
      this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.pOForm = this.fb.group({
      provider: ['',Validators.required]
    });
  }

  removeFromPO(productId: any) {
    this.purchaseService.removeItem(productId);
  }

  onSubmit(){
    this.purchaseService.registerPurchaseOrder(this.pOForm.get("provider").value).subscribe();
  }


}
