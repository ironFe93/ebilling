import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesShoppingCartComponent } from './sales-shopping-cart.component';

describe('SalesShoppingCartComponent', () => {
  let component: SalesShoppingCartComponent;
  let fixture: ComponentFixture<SalesShoppingCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesShoppingCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
