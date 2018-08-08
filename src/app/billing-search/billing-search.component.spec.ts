import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSearchComponent } from './billing-search.component';

describe('billingSearchComponent', () => {
  let component: BillingSearchComponent;
  let fixture: ComponentFixture<BillingSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
