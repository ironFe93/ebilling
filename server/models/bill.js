var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var company = require('./company');

// http://www.sunat.gob.pe/legislacion/superin/2017/anexoVII-117-2017.pdf

var billSchema = new Schema({
  fecha_emision: Date, //1
  firma: { //2
    ds_signature: String,
    cac_signature: String,
  },
  emisor: company, //3-6
  tipo_documento: {type: Number, default: 1},  //7
  id: { //8
    letra: {type: String, default: 'F' },
    serie: {type: Number, min: 0, max: 999},
    numero: {type: Number, min: 0, max: 99999999}
  },
  cliente: company, //9-10
  items: [{
    cod_medida: String, //11
    cantidad: Number, //12
    descripcion: String, //13
    valor_unitario: Number, //14
    precio_unitario: {  //15
      monto: Number,
      type_code: {type: Number, default: 1}
    },
    IGV: { //16
      tax_linea: Number, //16.1, 16.2
      tipo_afectacion: Number, //16.3 tax excemption reason code
      cod_trib: {type: Number, default: 1000},  //16.4 ID
      nombre_trib: {type: String, default: 'IGV'}, //16.5 taxName
      cod_intl: {type: String, default: 'VAT'} //16.6 taxTypeCode
    },
    isc: {}, //17
    valor_venta_bruto: Number,
    valor_venta: Number, //21 valor venta
    sku: String, //34
    valor_ref_unitario: { //35
      monto: Number,
      type_code: {type: Number, default: 2}
    },
    descuento: { //51
      factor: {type: Number, min:0, max: 1},
      monto: Number
    }
  }],
  total_valor_venta: {
    op_gravadas: Number, //18
    op_inafectas: Number, //19
    op_exoneradas: Number, //20
    op_gratuitas: Number //49
  },
  sum_IGV:{ //22
    monto: Number,
    cod_tributo: Number,
    nombre_tributo: String,
    cod_internacional: String
  },
  sum_ISC:{}, //23
  sum_otros_trib:{ //24
    monto: Number,
    cod_tributo: Number,
    nombre_tributo: String,
    cod_internacional: String
  },
  sum_otros: Number, //25
  total_descuentos: { //26
    tipo: String,
    monto: Number
  },
  importe_total_venta: Number, //27
  moneda: {type: String, default: 'PEN'}, //28
  guia_remision:{ //29 referncia a la guía de remisión
    id: String,
    cod_tipo_doc: {type: Number, default: 31}
  },
  otro_doc_referencia:{ //30
    id: String,
    cod_tipo_doc: Number
  },
  leyendas:{ //31
    cod_leyenda: String,
    descripcion: String
  },
  importe_percepcion:{ //32
    cod_tipo_monto: Number,
    base_imponible: Number,
    monto: Number,
    total_incluido_percepcion: Number
  },
  adicionales:{ //38-46
  },
  valor_ref_prelim:{ //47
    id: Number,
    nombre: String, 
    valor: Number
  },
  fecha_consumo:{ //48
    id: Number,
    value: Date
  },
  descuento_global: {
    factor: {type: Number, min:0, max: 1},
    monto: Number
  } //50
});

var Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;