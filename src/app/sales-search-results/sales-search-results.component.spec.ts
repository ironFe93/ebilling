import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSearchResultsComponent } from './sales-search-results.component';

describe('SalesSearchResultsComponent', () => {
  let component: SalesSearchResultsComponent;
  let fixture: ComponentFixture<SalesSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
