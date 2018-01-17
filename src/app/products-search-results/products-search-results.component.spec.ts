import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSearchResultsComponent } from './products-search-results.component';

describe('ProductsSearchResultsComponent', () => {
  let component: ProductsSearchResultsComponent;
  let fixture: ComponentFixture<ProductsSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
