const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceInlineSchema = require('../models/bill-invoice-inline').schema;
const taxSubtotalSchema = require('../models/tax-subtotal').schema;
//  http:// www.sunat.gob.pe/legislacion/superin/2017/anexoVII-117-2017.pdf

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
          IdentificationCode: { type: String, default: "PE" }
        }
      }
    }
  },
  AllowanceCharge: {
    ChargeIndicator: Boolean,
    AllowanceChargeReasonCode: String,
    MultiplierFactorNumeric: Number,
    Amount: Number,
    BaseAmount: Number
  },
  TaxTotal: {
    TaxAmount: Number, 
    TaxSubtotal: [taxSubtotalSchema]
  },
  LegalMonetaryTotal: {
    LineExtensionAmount: Number,
    TaxInclusiveAmount: Number,
    AllowanceTotalAmount: Number,
    ChargeTotalAmount: Number,
    PrepaidAmount: Number,
    PayableAmount: Number
  },
  InvoiceLine: [invoiceInlineSchema],
  sumValues: {}
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
