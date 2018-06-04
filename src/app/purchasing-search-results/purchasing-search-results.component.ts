import { Component, OnInit, Input } from '@angular/core';
import { PurchaseService } from '../purchase.service';
import { PurchaseOrder } from '../models/purchase-order';

@Component({
  selector: 'app-purchasing-search-results',
  templateUrl: './purchasing-search-results.component.html',
  styleUrls: ['./purchasing-search-results.component.css']
})
export class PurchasingSearchResultsComponent {

  constructor(private purchaseService: PurchaseService
  ) { }

  // instantiate posts to an empty array
  @Input() pOrders: any = [];
  @Input() selectedTab: number;

  displayPurchaseOrder(id: String) {
      this.purchaseService.getPOrderDetail(id).subscribe();
  }
}

