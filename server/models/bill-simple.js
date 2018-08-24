exports.createBill = ({
  ID,
  issueDate,
  cond_pago,
  dueDate,
  items = [],
  op_gravadas,
  op_exoneradas,
  op_inafectas,
  op_gratuitas,
  IGV,
  otros_trib,
  total_descuentos,
  importe_total, // 27
  moneda, // 28
  guia_remision,
  otro_doc,
  leyenda,
  descuento_global: {
    monto, 
    factor
  },
  cliente: {
    ruc,
    registrationName
  }
} = {}) => ({
  ID,
  issueDate,
  cond_pago,
  dueDate,
  items,
  op_gravadas,
  op_exoneradas,
  op_inafectas,
  op_gratuitas,
  IGV,
  otros_trib,
  total_descuentos,
  importe_total,
  moneda,
  guia_remision,
  otro_doc,
  leyenda,
  descuento_global: {
    monto,
    factor
  },
  cliente: {
    ruc,
    registrationName
  }
});

exports.createItem = ({
  cod_medida, // 11
  cantidad, // 12
  descripcion, // 13
  precio_unitario,
  IGV,
  cod, // 34
  factor_descuento
} = {}) => ({
  cod_medida, // 11
  cantidad, // 12
  descripcion, // 13
  precio_unitario,
  IGV,
  cod, // 34
  factor_descuento
});