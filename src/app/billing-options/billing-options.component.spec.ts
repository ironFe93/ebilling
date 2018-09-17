import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingOptionsComponent } from './billing-options.component';

describe('BillingOptionsComponent', () => {
  let component: BillingOptionsComponent;
  let fixture: ComponentFixture<BillingOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
