import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  
  sidenavWidth = 15;
  constructor ( private router: Router ) { }
  
  ngOnInit() {
  }

  increase () {
    this.sidenavWidth = 15;
  }

  decrease () {
    this.sidenavWidth = 15;
  }

}
