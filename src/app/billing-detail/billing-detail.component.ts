import { Component, OnInit } from '@angular/core';

import { BillsService } from '../billing.service';
import { Bill } from '../models/bill';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-billing-detail',
  templateUrl: './billing-detail.component.html',
  styleUrls: ['./billing-detail.component.css']
})
export class BillingDetailComponent implements OnInit {

  bill: Observable<Bill>;

  constructor(private billsService: BillsService) { }

  ngOnInit() {
    this.bill = this.billsService.getObservableBill();
  }

}
