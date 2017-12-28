// create a schema
export class Product {
  sku: string;
  type: string;
  title: string;
  description: string;
  pricing: {
    list: number;
    retail: number;
    savings: number;
    pct_savings: number;
  }
};