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
  bill_id;

  constructor(private billService: BillsService, private downloadService: DownloadService) { }

  ngOnInit() {
    this.bill$.subscribe(bill => {
      if (bill._id) this.billDetailLoaded = true;
      if (bill.Status) {
        this.isRejected = bill.Status.Rejected;
        this.isDraft = bill.Status.Draft;
        this.bill_id = bill._id;
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


}
