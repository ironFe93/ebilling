import { Component, OnInit } from '@angular/core';

import { SalesService } from '../sales.service';
import { Bill } from '../models/bill';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-detail',
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.css']
})
export class SalesDetailComponent implements OnInit {

  sale: Observable<Bill>;

  constructor(private cartService: SalesService) { }

  ngOnInit() {
    this.sale = this.cartService.getObservableSale();
  }

}
