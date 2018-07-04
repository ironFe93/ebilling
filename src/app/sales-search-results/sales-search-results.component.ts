import { Component, OnInit, Input } from '@angular/core';
import {SalesService} from '../sales.service';

@Component({
  selector: 'app-sales-search-results',
  templateUrl: './sales-search-results.component.html',
  styleUrls: ['./sales-search-results.component.css']
})
export class SalesSearchResultsComponent implements OnInit {

  @Input() sales: any = [];

  constructor(private salesService: SalesService) { }

  ngOnInit() {
  }

  getSaleDetails(saleId: any) {
    this.salesService.getSaleDetail(saleId).subscribe();
  }

}
