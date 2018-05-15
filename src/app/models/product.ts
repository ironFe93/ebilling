import {Cart} from './cart';

// create a schema
export class Product {
  _id: any;
  sku: string;
  type: string;
  title: string;
  description: string;
  pricing: {
    list: number;
    retail: number;
    savings: number;
    pct_savings: number;
  };
  inventory: {
    qty: number;
    carted: {
      qty: number;
      cart_id: Cart[];
      timestamp: string;
    }[]
  }
};