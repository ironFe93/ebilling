import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReqDetailsComponent } from './inventory-req-details.component';

describe('InventoryReqDetailsComponent', () => {
  let component: InventoryReqDetailsComponent;
  let fixture: ComponentFixture<InventoryReqDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReqDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReqDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
