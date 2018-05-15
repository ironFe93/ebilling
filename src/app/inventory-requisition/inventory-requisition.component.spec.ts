import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequisitionComponent } from './inventory-requisition.component';

describe('InventoryRequisitionComponent', () => {
  let component: InventoryRequisitionComponent;
  let fixture: ComponentFixture<InventoryRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
