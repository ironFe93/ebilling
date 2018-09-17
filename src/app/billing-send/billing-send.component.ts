import { Component, OnInit } from '@angular/core';
import { BillsService } from '../billing.service';

import * as jsPDF from 'jspdf';
import { DownloadService } from '../download.service';

@Component({
  selector: 'app-billing-send',
  templateUrl: './billing-send.component.html',
  styleUrls: ['./billing-send.component.css']
})
export class BillingSendComponent implements OnInit {

  canvasPromise;
  private bill$ = this.billService.getObservableDetailBill();
  isDraft = false;
  isRejected = false;
  billDetailLoaded = false;

  constructor(private billService: BillsService, private downloadService: DownloadService) { }

  ngOnInit() {
    this.bill$.subscribe(bill => {
      if (bill._id) this.billDetailLoaded = true;
      if (bill.Status) {
        this.isRejected = bill.Status.Rejected;
        this.isDraft = bill.Status.Draft;
      }
    });
  }

  sunat() {
    this.billService.sendSunat().subscribe();
  }

  email() {
  }

  download() {
    this.downloadService.pdf();
  }

  retrySunat() {

  }

  sendSunat() {
    this.billService.sendSunat().subscribe();
  }

}
