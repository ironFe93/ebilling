import { Component, OnInit, Input } from '@angular/core';
import {BillsService} from '../billing.service';

@Component({
  selector: 'app-billing-search-results',
  templateUrl: './billing-search-results.component.html',
  styleUrls: ['./billing-search-results.component.css']
})
export class BillingSearchResultsComponent implements OnInit {

  @Input() billing: any = [];

  constructor(private billsService: BillsService) { }

  ngOnInit() {
  }

  getSaleDetails(saleId: any) {
    this.billsService.getBillDetail(saleId).subscribe();
  }

}
