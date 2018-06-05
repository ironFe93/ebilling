import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardComponent } from '../dashboard.component';

@Component({
  selector: 'app-dash-prod-dialog',
  templateUrl: './dash-prod-dialog.component.html',
  styleUrls: ['./dash-prod-dialog.component.css']
})
export class DashProdDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
