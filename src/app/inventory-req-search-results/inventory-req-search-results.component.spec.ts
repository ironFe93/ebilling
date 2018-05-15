import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReqSearchResultsComponent } from './inventory-req-search-results.component';

describe('InventoryReqSearchResultsComponent', () => {
  let component: InventoryReqSearchResultsComponent;
  let fixture: ComponentFixture<InventoryReqSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReqSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReqSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
