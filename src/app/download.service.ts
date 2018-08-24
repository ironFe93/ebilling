import { Injectable } from '@angular/core';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

declare global {
  interface Window { html2canvas: any; }
}

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private ratio: number;
  private canvas;

  constructor() {
    window.html2canvas = html2canvas || {};
  }

  darkenMatTable(printDiv: HTMLElement) {
    const headerRows = printDiv.getElementsByClassName('mat-header-cell');
    for (let i = 0; i < headerRows.length; i++) {
      (printDiv.getElementsByClassName('mat-header-cell')[i] as HTMLElement).style.color = 'black';
    }

    const tabRows = printDiv.getElementsByClassName('mat-row');
    for (let i = 0; i < tabRows.length; i++) {
      (printDiv.getElementsByClassName('mat-row')[i] as HTMLElement).style.borderBottomColor = 'rgba(0,0,0,.42)';
    }

    (printDiv.getElementsByClassName('mat-header-row')[0] as HTMLElement).style.borderBottomColor = 'rgba(0,0,0,.42)';

    return printDiv;
  }

  saveCanvas() {

    let printDiv = document.getElementById('print');
    printDiv = this.darkenMatTable(printDiv);

    const divHeight = printDiv.scrollHeight;
    const divWidth = printDiv.scrollWidth;
    this.ratio = divHeight / divWidth;

    this.canvas = html2canvas(printDiv,
      {
        scale: 3,
        height: divHeight,
        width: divWidth
      });
    return this.canvas;
  }

  pdf() {
    const doc = new jsPDF('l', 'mm', 'a4');

    this.canvas.then(canvas => {
      const image = canvas.toDataURL('image/png');
      const width = doc.internal.pageSize.getWidth();
      const height = this.ratio * width;
      doc.addImage(image, 'PNG', 10, 10, width - 20, height - 10);
      doc.save('test.pdf');
    });
  }
}
