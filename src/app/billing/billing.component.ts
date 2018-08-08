import { Component } from '@angular/core';

@Component({
  selector: 'app-billing',
  template: `
  <mat-tab-group>
    <mat-tab label="Factura">
      <app-billing-create-bill></app-billing-create-bill>
    </mat-tab>
    <mat-tab label="Consultas">
      <div fxLayout="row wrap">
        <app-billing-search fxFlex="auto"></app-billing-search>
        <app-billing-detail fxFlex="auto"></app-billing-detail>
      </div>
    </mat-tab>
  </mat-tab-group>`
})
export class BillingComponent {

  constructor() { }

}
