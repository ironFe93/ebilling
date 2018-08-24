import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreateBillComponent } from '../billing-create-bill/billing-create-bill.component';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { MatStepper } from '@angular/material';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { DownloadService } from '../download.service';
import { BillsService } from '../billing.service';

@Component({
  selector: 'app-billing',
  templateUrl: 'billing.html'
})
export class BillingComponent implements AfterViewInit {

  @ViewChild(CreateBillComponent)
  private createBillComponent: CreateBillComponent;
  @ViewChild('stepper') stepper: MatStepper;

  isLinear = true;
  step1Completed = false;
  step2Completed = false;
  ratio: number;
  canvasPromise;

  constructor(private changeDet: ChangeDetectorRef, private downloadService: DownloadService,
  private billService: BillsService) { }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  ngAfterViewInit() {
    this.firstFormGroup = this.createBillComponent.getBillForm();
    this.stepper.selectionChange.subscribe(
      x => {
        if (x.previouslySelectedIndex === 1 && x.previouslySelectedIndex > x.selectedIndex) {
          this.step1Completed = false; // this deactivates the header.
        }
      }
    );
  }

  submitFirst() {
    this.createBillComponent.onSubmit().subscribe(
      x => {
        if (!(x instanceof HttpErrorResponse || x instanceof Error)) {
          this.step1Completed = true;
          this.changeDet.detectChanges();
          this.stepper.next();
        }
      }
    );
  }

  submitSecond() {
    this.downloadService.saveCanvas().then(() => {
      this.step2Completed = true;
      this.changeDet.detectChanges();
      this.stepper.next();
    });
  }

  editPrevious() {
    this.stepper.previous();
    this.step1Completed = false;
  }

  finish() {
    this.step1Completed = false;
    this.step2Completed = false;
    this.changeDet.detectChanges();
    this.stepper.reset();
    this.billService.clear();
    this.createBillComponent.getBillForm().reset();
  }

}
