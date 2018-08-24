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

  categorias: any[];
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productsService: ProductsService) {
    this.createForm();
  }

  createForm() {
    this.productForm = this.fb.group({
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      cod_medida: ['', Validators.required],
      ref_price: [0],
      inventario : this.fb.group({
        cantidad: [0, Validators.required]
      }),
    });
  }

  onSubmit() {
    const product: Product = this.productForm.value;
    this.productsService.createProduct(product).subscribe();
  }

  ngOnInit() {
    this.productsService.getCategories().subscribe(x => this.categorias = x);
  }

}
