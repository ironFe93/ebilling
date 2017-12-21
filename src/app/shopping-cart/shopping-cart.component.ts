import { Component, OnInit } from '@angular/core';

import {ShoppingCartService} from '../shopping-cart.service';
import {Cart} from '../models/cart';
import {Product} from '../models/product';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cart: Cart;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit() {
    
     this.cartService.createCart().subscribe(cart => {
      this.cart = cart;
    });

    console.log(this.cartService.logger);
  }

  addItemClick(product: Product, quantity: number) {
    
     this.cartService.addItem(product, quantity ).subscribe(cart => {
      this.cart = cart;
    });

    
  }



}
