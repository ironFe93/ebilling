import { Component, OnInit } from '@angular/core';

import { SalesService } from '../sales.service';
import { Sale } from '../models/cart';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-detail',
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.css']
})
export class SalesDetailComponent implements OnInit {

  sale: Observable<Sale>;

  constructor(private cartService: SalesService) { }

  ngOnInit() {
    this.sale = this.cartService.getObservableSale();
  }

}
