import { Component, OnInit } from '@angular/core';
import { PurchaseInvoice } from '../models/purchase-invoice';
import { PurchaseService } from '../purchase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-purchasing-detail',
  templateUrl: './purchasing-detail.component.html',
  styleUrls: ['./purchasing-detail.component.css']
})
export class PurchasingDetailComponent {

  constructor(private purchaseService: PurchaseService) { }
  invoice: Observable<PurchaseInvoice> = this.purchaseService.getInvoiceDetailAsObservable();

}
