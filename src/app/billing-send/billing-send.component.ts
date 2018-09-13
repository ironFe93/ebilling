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
  private bill$;
  constructor(private billService: BillsService, private downloadService: DownloadService) { }

  ngOnInit() {
    this.bill$ = this.billService.getObservableBill();
  }

  sunat() {
    this.billService.sendSunat().subscribe();
  }

  email() {
  }

  download() {
    this.downloadService.pdf();
  }

}
