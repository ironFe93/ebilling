import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {

  //two way property var to know which tab we are on
  selectedTab: number;

  constructor(private activatedRoute: ActivatedRoute,
  private cartService: ShoppingCartService) { }

  ngOnInit() {
    this.selectedTab = 0;
    
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
/*       let userId = params['userId'];
      console.log(userId); */
    });
  }

  //create cart only if tab Venta is selected and Cart is empty.
  createCart(){
    console.log("tab: " + this.selectedTab);
    if (this.selectedTab==1){
      console.log("creating cart...");
      if(!this.cartService.getCart()._id) this.cartService.createCart().subscribe();
    }
  }
}
