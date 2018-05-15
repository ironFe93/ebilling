import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReqSearchComponent } from './inventory-req-search.component';

describe('InventoryReqSearchComponent', () => {
  let component: InventoryReqSearchComponent;
  let fixture: ComponentFixture<InventoryReqSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReqSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReqSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
