import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {Product} from '../models/product';
import { ProductsService } from '../products.service';


@Component({
  selector: 'app-products-create',
  templateUrl: './products-create.component.html',
  styleUrls: ['./products-create.component.css']
})
export class ProductsCreateComponent implements OnInit {

  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productsService: ProductsService) { // <--- inject FormBuilder
    this.createForm();
  }

  createForm() {
    this.productForm = this.fb.group({
      title: ['test', Validators.required], // <--- the FormControl called "title"
      sku: ['',Validators.required],
      listPrice:['2000', Validators.required],
      inventory : this.fb.group({
        qty: ['50', Validators.required]
      }),
      description: ['']
    });
  }

  onSubmit(){
    console.log(this.productForm.value);
    const product: Product = this.productForm.value;
    this.productsService.createProduct(product).subscribe(resp => console.log(resp));
  }

  ngOnInit() {
  }

}
