import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ProductReq } from '../models/product-req';
import { ProductsService } from '../products.service';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-inventory-req-details',
  templateUrl: './inventory-req-details.component.html',
  styleUrls: ['./inventory-req-details.component.css']
})
export class InventoryReqDetailsComponent {

  constructor(private productsService: ProductsService,
    private purchasingService: PurchaseService, private router: Router) { }
  req: Observable<ProductReq> = this.productsService.getReqDetailAsObservable();

  convertToPO() {
    let reqItems : {};
    this.productsService.getReqDetailAsObservable()
      .subscribe(req => reqItems = req.items);
    this.purchasingService.clearPO();
    this.purchasingService.addItemsFromReq(reqItems);
    this.router.navigateByUrl('/purchasing');

  }

}
