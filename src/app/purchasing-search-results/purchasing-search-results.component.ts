import { Component, OnInit, Input } from '@angular/core';
import { PurchaseService } from '../purchase.service';
import { PurchaseInvoice } from '../models/purchase-invoice';

@Component({
  selector: 'app-purchasing-search-results',
  templateUrl: './purchasing-search-results.component.html',
  styleUrls: ['./purchasing-search-results.component.css']
})
export class PurchasingSearchResultsComponent {

  constructor(private purchaseService: PurchaseService) { }

  // instantiate posts to an empty array
  @Input() invoices: any = [];

  displayInvoice(id: String) {
      this.purchaseService.getInvoiceDetail(id).subscribe();
  }
}

