import { Item } from './item';
export class Bill {
  cod?: string;
  items: Item[] = [];
  fecha_emision: Date;
  cliente: {
    ruc: {
      number: number;
      type: number;
    };
    registration_name: string;
    email?: string;
  };
  descuento_global?: {
    factor: {type: number, min: 0 , max: 1 }
  };
  moneda: string;
}
