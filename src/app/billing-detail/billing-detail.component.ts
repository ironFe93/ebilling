import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';

import { BillsService } from '../billing.service';

import { MatTableDataSource } from '../../../node_modules/@angular/material';
import { DownloadService } from '../download.service';

@Component({
  selector: 'app-billing-detail',
  templateUrl: './billing-detail.component.html',
  styleUrls: ['./billing-detail.component.css']
})
export class BillingDetailComponent implements OnInit {
  isLoading = false;

  displayedColumns = ['codigo', 'cantidad', 'medida',
    'descripcion', 'precio_unit', 'IGV', 'sum IGV', 'valor_v', 'valor_v_total', 'total'];

  displayedColumnsSum = ['sum', 'val'];
  dataSource = new MatTableDataSource<any>();
  bill$ = this.billsService.getObservableDetailBill();

  igvNames = { 10: 'gravado', 20: 'exonerado', 30: 'inafecto' };
  @Input() stepper = false;

  constructor(private billsService: BillsService,
    private changeDet: ChangeDetectorRef, private downloadService: DownloadService) {
  }

  ngOnInit() {
    if (!this.stepper) {
      this.bill$ = this.billsService.getObservableDetailBill();
    }else {
      this.bill$ = this.billsService.getObservableBill();
    }
    this.bill$.subscribe(bill => {
      this.dataSource.data = bill.InvoiceLine;
      this.changeDet.detectChanges();
    });
  }

}
