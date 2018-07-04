export class Sale {
  _id: any;
  last_modified: Date;
  status: string;
  grossTotal: number;
  itemsTotal: number;
  items: {
    sku: string;
    qty: number;
    title: string;
    listPrice: number
  }[] = [];
}
