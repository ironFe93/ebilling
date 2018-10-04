const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceLineSchema = require('../models/bill-invoice-inline').schema;
const taxSubtotalSchema = require('../models/tax-subtotal').schema;

const billSchema = new Schema({
  ID: String,
  IssueDate: Date,
  cond_pago: Number,
  DueDate: Date,
  InvoiceTypeCode: String,
  Note: String,
  DocumentCurrencyCode: { type: String, enum: ["PEN", "USD"] },
  DespatchDocumentReference: {
    ID: String
  },
  AdditionalDocumentReference: {
    ID: String
  },
  AccountingSupplierParty: {
    PartyIdentification: {
      ID: String,
      schemeID: String,
    },
    PartyName: String, // nombre comercial
    PartyLegalEntity: {
      RegistrationName: String
    }
  },
  AccountingCustomerParty: {
    PartyIdentification: {
      ID: String,
      schemeID: String,
    },
    PartyLegalEntity: {
      RegistrationName: String // nombre legal
    }
  },
  DeliveryTerms: {
    DeliveryLocation: {
      Address: {
        StreetName: String,
        CitySubDivisionName: String,
        CityName: String,
        CountrySubentity: String,
        CountrySubentityCode: Number, // ZIp code
        District: String,
        Country: {
          IdentificationCode: String
        }
      }
    }
  },
  AllowanceCharge: {
    ChargeIndicator: Boolean,
    AllowanceChargeReasonCode: String,
    MultiplierFactorNumeric: Number,
    Amount: { type: Number, set: v => v.toFixed(2) },
    BaseAmount: { type: Number, set: v => v.toFixed(2) }
  },
  TaxTotal: {
    TaxAmount: { type: Number, set: v => v.toFixed(2) },
    TaxSubtotal: [taxSubtotalSchema]
  },
  LegalMonetaryTotal: {
    LineExtensionAmount: { type: Number, set: v => v.toFixed(2) },
    TaxInclusiveAmount: { type: Number, set: v => v.toFixed(2) },
    AllowanceTotalAmount: { type: Number, set: v => v.toFixed(2) },
    ChargeTotalAmount: { type: Number, set: v => v.toFixed(2) },
    PrepaidAmount: { type: Number, set: v => v.toFixed(2) },
    PayableAmount: { type: Number, set: v => v.toFixed(2) }
  },
  InvoiceLine: [invoiceLineSchema],
  sumValues: {
    sumValorVentaBruto: {type: Number, default: 0, set: v => v.toFixed(2)},
    sumDescuentosPorItem: {type: Number, default: 0, set: v => v.toFixed(2)},
    sumValorVentaPorItem: {type: Number, default: 0, set: v => v.toFixed(2)},
    descuentoGlobal: {type: Number, default: 0, set: v => v.toFixed(2)},
    totalDescuentos: {type: Number, default: 0, set: v => v.toFixed(2)},
    totalOperacionesGravadas: {type: Number, default: 0, set: v => v.toFixed(2)},
    totalOperacionesExoneradas: {type: Number, default: 0, set: v => v.toFixed(2)},
    totalOperacionesInafectas: {type: Number, default: 0, set: v => v.toFixed(2)},
    sumIGV: {type: Number, default: 0, set: v => v.toFixed(2)},
    total: {type: Number, default: 0, set: v => v.toFixed(2)}
  },
  Status: {
    Draft: Boolean,
    Rejected: Boolean,
    ResponseCode: String,
    Description: String,
    ID: String
  }
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
