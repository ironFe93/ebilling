import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SalesService } from '../sales.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  // two way property var to know which tab we are on
  selectedTab: number;

  constructor(private activatedRoute: ActivatedRoute,
    private cartService: SalesService) { }

  ngOnInit() {
    this.selectedTab = 0;
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      /*       let userId = params['userId'];
            console.log(userId); */
    });
  }

  // create cart only if tab Venta is selected and cart is empty.
  // this controls that a cart will not be created unless the correct tab is selected.
  createCart() {
    console.log('tab: ' + this.selectedTab);
    if (this.selectedTab === 1) {
      if (!this.cartService.checkIfCartExists()) {
        this.cartService.createCart().subscribe();
      }
    }
  }

}
