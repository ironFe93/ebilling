import { Component, OnInit, Injectable } from '@angular/core';

import { Product } from '../models/product';
import { ProductsService } from '../products.service';

import { Observable } from 'rxjs';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {

  $product: Observable<Product> = this.productsService.getProductObservable();

  constructor(private productsService: ProductsService,
    private bottomSheetRef: MatBottomSheetRef<DashboardComponent>) { }

  ngOnInit() {
  }

}
