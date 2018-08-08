import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSearchResultsComponent } from './billing-search-results.component';

describe('billingSearchResultsComponent', () => {
  let component: BillingSearchResultsComponent;
  let fixture: ComponentFixture<BillingSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
