import { Component, OnInit } from '@angular/core';

import {BillsService} from '../billing.service';
import {Bill} from '../models/bill';
import { FormGroup, FormBuilder } from '../../../node_modules/@angular/forms';
import { debounceTime, tap, switchMap, finalize } from '../../../node_modules/rxjs/operators';
import { MatAutocompleteSelectedEvent } from '../../../node_modules/@angular/material';

@Component({
  selector: 'app-billing-search',
  templateUrl: './billing-search.component.html',
  styleUrls: ['./billing-search.component.css']
})
export class BillingSearchComponent implements OnInit {

  filteredBills: Bill[] = [];
  billForm: FormGroup;
  isLoading = false;

  constructor(private billsService: BillsService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.buildBillForm();
    this.initBillForm();
  }

  buildBillForm() {
    this.billForm = this.fb.group({
      userInput: ''
    });
  }

  initBillForm() {
    // Async Autocomplete setup
    this.billForm
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.billsService.getByTerms(value)
          .pipe(
            finalize(() => this.isLoading = false),
        )
        )
      )
      .subscribe(bills => this.filteredBills = bills);
  }

  displayFn(bill: any) {
    if (bill) { return bill.AccountingCustomerParty.Party.PartyTaxScheme.RegistrationName; }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    const bill: Bill = event.option.value;
    this.billsService.getBillDetail(bill._id).subscribe();
    this.billForm.get('userInput').setValue('');
  }

}
