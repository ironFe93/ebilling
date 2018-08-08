import { Component, OnInit } from '@angular/core';

import {BillsService} from '../billing.service';
import {Bill} from '../models/bill';

@Component({
  selector: 'app-billing-search',
  templateUrl: './billing-search.component.html',
  styleUrls: ['./billing-search.component.css']
})
export class BillingSearchComponent implements OnInit {

  // a sale is a shopping cart with status = complete;
  billing: Bill[];

  constructor(private billsService: BillsService) {
  }

  ngOnInit() {
  }

  onEnter(value: string) {
    this.billsService.getBills(value).subscribe(billing => {
      this.billing = billing;
    });
  }

}
