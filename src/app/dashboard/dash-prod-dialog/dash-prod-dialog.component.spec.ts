import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashProdDialogComponent } from './dash-prod-dialog.component';

describe('DashProdDialogComponent', () => {
  let component: DashProdDialogComponent;
  let fixture: ComponentFixture<DashProdDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashProdDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashProdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
