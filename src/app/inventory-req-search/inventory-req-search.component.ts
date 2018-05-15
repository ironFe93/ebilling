import { Component, OnInit } from '@angular/core';
import { ProductReq } from '../models/product-req';
import { ProductsService } from '../products.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory-req-search',
  templateUrl: './inventory-req-search.component.html',
  styleUrls: ['./inventory-req-search.component.css']
})
export class InventoryReqSearchComponent implements OnInit {

  //a sale is a shopping cart with status = complete;
  reqs: ProductReq[];
  reqForm: FormGroup;

  constructor(private fb: FormBuilder, private productsService: ProductsService) { // <--- inject FormBuilder
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.reqForm = this.fb.group({
      string: ['',Validators.required],
      date1: [''],
      date2: [''],
      status: ['open', Validators.required],
    });
  }

  onSubmit(){
    this.productsService.findReqs(this.reqForm.value).subscribe(reqs => this.reqs = reqs);
  }

}
