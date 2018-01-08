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

  constructor(private cartService: ShoppingCartService) { 

  }

  ngOnInit() {

    this.observableCart = this.cartService.getObservableCart(); 
    this.cartService.createCart().subscribe();

  }

  removeFromCart(productId : any){
    this.cartService.removeItem(productId).subscribe();
  }

  addOne(productId : any){
    this.cartService.addOne(productId).subscribe();
  }

  removeOne(productId : any){
    this.cartService.removeOne(productId).subscribe();
  }




}