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
  ////////
  DespatchDocumentReference: {
    ID: String,
    DocumentTypeCode: { type: Number, enum: [9] }
  },
  AdditionalDocumentReference: {
    ID: String,
    DocumentTypeCode: Number
  },
  AccountingSupplierParty: {
    PartyIdentification: {
      ID: String,
      schemeID: String,
    },
    PartyName:  String // nombre comercial
    , PartyLegalEntity: {
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
    Amount: {type: Number, set: v => v.toFixed(2)},
    BaseAmount: {type: Number, set: v => v.toFixed(2)}
  },
  TaxTotal: {
    TaxAmount: {type: Number, set: v => v.toFixed(2)}, 
    TaxSubtotal: [taxSubtotalSchema]
  },
  LegalMonetaryTotal: {
    LineExtensionAmount: {type: Number, set: v => v.toFixed(2)},
    TaxInclusiveAmount: {type: Number, set: v => v.toFixed(2)},
    AllowanceTotalAmount: {type: Number, set: v => v.toFixed(2)},
    ChargeTotalAmount: {type: Number, set: v => v.toFixed(2)},
    PrepaidAmount: {type: Number, set: v => v.toFixed(2)},
    PayableAmount: {type: Number, set: v => v.toFixed(2)}
  },
  InvoiceLine: [invoiceLineSchema],
  sumValues: {}
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
