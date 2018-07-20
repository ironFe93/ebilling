export class Bill {
  items: {
    cantidad: Number; // 12
    precio_unitario: {  // 15
      monto: {type: Number, default: 0};
      type_code: {type: Number, default: 1}
    };
    valor_ref_unitario: {  // 15
      monto: Number;
      type_code: Number;
    };
    IGV: {
      afectacion_tipo: Number
    };
    descuento: {
      factor: {type: Number, min: 0 , max: 1 }
    };
    sku: String;
  }[] = [];
  cliente: {
    ruc: {
      number: Number;
      type: Number;
    };
    registration_name: String;
    email: String;
  };
  descuento_global: {
    factor: {type: Number, min: 0 , max: 1 }
  };
}
