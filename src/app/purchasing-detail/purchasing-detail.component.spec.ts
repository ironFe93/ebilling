import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingDetailComponent } from './purchasing-detail.component';

describe('PurchasingDetailComponent', () => {
  let component: PurchasingDetailComponent;
  let fixture: ComponentFixture<PurchasingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
