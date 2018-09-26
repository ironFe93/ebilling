import { Component, OnInit } from '@angular/core';
import { BillsService } from '../billing.service';
import { DownloadService } from '../download.service';

@Component({
  selector: 'app-billing-options',
  templateUrl: './billing-options.component.html',
  styleUrls: ['./billing-options.component.css']
})
export class BillingOptionsComponent implements OnInit {

  private bill$ = this.billService.getObservableDetailBill();
  isDraft = false;
  isRejected = false;
  billDetailLoaded = false;
  isEditable = false;
  bill_id;

  constructor(private billService: BillsService, private downloadService: DownloadService) { }

  ngOnInit() {
    this.bill$.subscribe(bill => {
      if (bill._id) this.billDetailLoaded = true;
      if (bill.Status) {
        this.isRejected = bill.Status.Rejected;
        this.isDraft = bill.Status.Draft;
        this.bill_id = bill._id;
        if (bill.Status.ResponseCode > 0 || !bill.Status.ResponseCode) this.isEditable = true; else this.isEditable = false;
      }
    });
  }

  email() {
  }

  async download() {
    const canvas = await this.downloadService.saveCanvas();
    this.downloadService.pdf(canvas);
  }

  retrySunat() {

  }

  sendSunat() {
    this.billService.sendSunat(this.bill_id).subscribe();
  }

  edit() {
    this.billService.prepareForUpdate();
  }


}
