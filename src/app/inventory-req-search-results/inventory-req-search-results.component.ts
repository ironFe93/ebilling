import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-inventory-req-search-results',
  templateUrl: './inventory-req-search-results.component.html',
  styleUrls: ['./inventory-req-search-results.component.css']
})
export class InventoryReqSearchResultsComponent implements OnInit {

  @Input() reqs: any = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
  }

  getReqDetail(id: any) {
    this.productsService.getReqDetail(id).subscribe();
  }
}
