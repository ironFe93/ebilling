import { Component, OnInit } from '@angular/core';
import { PurchaseOrder } from '../models/purchase-order';
import { PurchaseService } from '../purchase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-purchasing-detail',
  templateUrl: './purchasing-detail.component.html',
  styleUrls: ['./purchasing-detail.component.css']
})
export class PurchasingDetailComponent{

  constructor(private purchaseService: PurchaseService) { }
  pOrder: Observable<PurchaseOrder> = this.purchaseService.getObservablePODetail();

  

}
