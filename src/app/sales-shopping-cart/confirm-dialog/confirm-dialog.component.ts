import { Component, OnInit, Inject } from '@angular/core';

import {SalesService} from '../../sales.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private salesService: SalesService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.salesService.completeCartCheckout(this.data.ruc, this.data.rs).subscribe();
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
