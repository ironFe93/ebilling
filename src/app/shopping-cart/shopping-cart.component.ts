import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ShoppingCartService } from '../shopping-cart.service';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  observableCart: Observable<Cart>;
  cartSubscription: Subscription; //so we can unsub later.
  public itemCount : number;

  constructor(private cartService: ShoppingCartService) { 

  }

  ngOnInit() {
    //We only get the Observable of a Cart because the async pipe will subscribe to it automagically.
    this.observableCart = this.cartService.createCart();
    this.itemCount = 0;


  }




}