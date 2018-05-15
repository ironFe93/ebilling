import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingSearchComponent } from './purchasing-search.component';

describe('PurchasingSearchComponent', () => {
  let component: PurchasingSearchComponent;
  let fixture: ComponentFixture<PurchasingSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasingSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
