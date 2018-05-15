import { Component, OnInit, Input } from '@angular/core';
import { PurchaseOrder } from '../models/purchase-order';
import { PurchaseService } from '../purchase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-purchasing-search',
  templateUrl: './purchasing-search.component.html',
  styleUrls: ['./purchasing-search.component.css']
})
export class PurchasingSearchComponent {

  pOrders: PurchaseOrder[];
  pOForm: FormGroup;

  constructor(private purchaseService: PurchaseService, private fb: FormBuilder,) { 
    this.createForm();
  }

  createForm() {
    this.pOForm = this.fb.group({
      string: ['',Validators.required],
      provider: ['',Validators.required],
      datePlaced1: [''],
      datePlaced2: [''],
      dateSent1: [''],
      dateSent2: [''],
      status: ['open', Validators.required],
    });
  }
 
  onSubmit(value: string) { 
    this.purchaseService.findPOrders(this.pOForm.value).subscribe(pOrders => {
      this.pOrders = pOrders;
    });
  }

}
