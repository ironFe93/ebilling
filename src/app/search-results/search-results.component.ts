import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  // instantiate posts to an empty array
  @Input() products: any = [];
  terms: String;

    ngOnInit() {

    }

}
