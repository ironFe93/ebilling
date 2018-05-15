import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingSearchResultsComponent } from './purchasing-search-results.component';

describe('PurchasingSearchResultsComponent', () => {
  let component: PurchasingSearchResultsComponent;
  let fixture: ComponentFixture<PurchasingSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasingSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasingSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
