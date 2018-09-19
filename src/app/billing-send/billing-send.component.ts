import { Component, OnInit, Input } from '@angular/core';
import { BillsService } from '../billing.service';

import * as jsPDF from 'jspdf';
import { DownloadService } from '../download.service';
import { Bill } from '../models/bill';

@Component({
  selector: 'app-billing-send',
  templateUrl: './billing-send.component.html',
  styleUrls: ['./billing-send.component.css']
})
export class BillingSendComponent implements OnInit {

  @Input() canvas;
  bill$;
  isDraft = false;
  isRejected = false;
  bill_id;

  constructor(private billService: BillsService, private downloadService: DownloadService) { }

  ngOnInit() {
    this.bill$ = this.billService.getObservableBill();
    this.bill$.subscribe((bill: Bill) => {
      if (bill.Status) {
        this.isRejected = bill.Status.Rejected;
        this.isDraft = bill.Status.Draft;
        this.bill_id = bill._id;
      }
    });
  }

  email() {
  }

  download() {
    this.downloadService.pdf(this.canvas);
  }

  retrySunat() {

  }

  sendSunat() {
    this.billService.sendSunat(this.bill_id).subscribe();
  }

}
