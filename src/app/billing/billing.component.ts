import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreateBillComponent } from '../billing-create-bill/billing-create-bill.component';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { MatStepper, MatTabGroup} from '@angular/material';

import { DownloadService } from '../download.service';
import { BillsService } from '../billing.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-billing',
  templateUrl: 'billing.html'
})
export class BillingComponent implements OnInit, AfterViewInit {

  @ViewChild(CreateBillComponent)
  private createBillComponent: CreateBillComponent;
  @ViewChild('stepper') stepper: MatStepper;
  @Input() selectedIndex;

  selectedIndex$;
  isLinear = true;
  step1Completed = false;
  step2Completed = false;
  ratio: number;
  canvas;

  constructor(private changeDet: ChangeDetectorRef, private downloadService: DownloadService,
    private billService: BillsService) { }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  ngOnInit() {
    this.selectedIndex$ = this.billService.tabGroupIndex.subscribe(x => {
      this.selectedIndex = x;
      console.log(this.selectedIndex);
    });

    this.stepper.selectedIndex = this.billService.billStepperIndex.getValue();
    if (this.stepper.selectedIndex === 1) this.step1Completed = true;
    if (this.stepper.selectedIndex === 2) this.step2Completed = true;
    this.changeDet.detectChanges();
  }

  ngAfterViewInit() {
    this.firstFormGroup = this.createBillComponent.getBillForm();
    this.stepper.selectionChange.subscribe(
      x => {
        this.billService.billStepperIndex.next(x.selectedIndex);
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

  async submitSecond() {
    this.canvas = await this.downloadService.saveCanvas();
    this.step2Completed = true;
    this.changeDet.detectChanges();
    this.stepper.next();
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
    this.createBillComponent.buildBillForm();
  }

}
