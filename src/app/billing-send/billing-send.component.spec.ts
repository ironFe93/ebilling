import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSendComponent } from './billing-send.component';

describe('BillingSendComponent', () => {
  let component: BillingSendComponent;
  let fixture: ComponentFixture<BillingSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
