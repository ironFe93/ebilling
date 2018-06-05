import { Component } from '@angular/core';
import { ProductsService } from '../products.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory-requisition',
  templateUrl: './inventory-requisition.component.html',
  styleUrls: ['./inventory-requisition.component.css']
})
export class InventoryRequisitionComponent{
  
  constructor(private productsService: ProductsService) { }

  observableProdReq = this.productsService.getProductReqAsObservable();

  submitReq() {
    this.productsService.registerReq().subscribe();
  }

  removeFromReq(sku: any) {
    this.productsService.removeFromReq(sku);
  }

}
