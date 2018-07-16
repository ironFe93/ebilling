export class Sale {
  _id: any;
  last_modified: Date;
  client: {
    name: string;
    ruc: string;
  };
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
