import { Item } from './item';
export interface Bill {
  _id?: string;
  cod?: string;
  items: Item[];
  fecha_emision: Date;
  cond_pago: number;
  cliente: {
    ruc: number;
    registration_name: string;
    email?: string;
  };
  descuento_global?: {
    factor: {type: number, min: 0 , max: 1 }
  };
  guia_remision?: string;
  otro_doc?: string;
  moneda: string;
}
