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
  InvoiceTypeCode: {
    val: String
  },
  Note: {
    val: String
  },
  DocumentCurrencyCode: {
    val: { type: String, enum: ["PEN", "USD"] }
  },
  ////////
  DespatchDocumentReference: {
    ID: String,
    DocumentTypeCode: {
      val: { type: Number, enum: [9] }
    }
  },
  AdditionalDocumentReference: {
    ID: String,
    DocumentTypeCode: {
      val: Number
    }
  },
  AccountingSupplierParty: {
    Party: {
      PartyIdentification: {
        ID: {
          att: {
            schemeID: Number
          },
          val: Number // RUC
        }
      }, PartyName: {
        Name: String // nombre comercial
      }, PartyLegalEntity: {
        RegistrationName: String
      }
    }
  },
  AccountingCustomerParty: {
    Party: {
      PartyIdentification: {
        ID: {
          att: {
            schemeID: Number,
          },
          val: Number // RUC
        }
      }, PartyLegalEntity: {
        RegistrationName: String // nombre legal
      }
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
          IdentificationCode: {
            att: {
              listID: { type: String, default: "ISO3166-1" },
              listAgencyName: { type: String, default: "United Nations Economic Commission for Europe" },
              listName: { type: String, default: "Country" }
            },
            val: { type: String, default: "PE" }
          }
        }
      }
    }
  },
  AllowanceCharge: {
    ChargeIndicator: Boolean,
    AllowanceChargeReasonCode: String,
    MultiplierFactorNumeric: Number,
    Amount: {
      val: Number
    },
    BaseAmount: {
      val: Number
    }
  },
  TaxTotal: {
    TaxAmount: {
      val: Number
    }, TaxSubtotal: [taxSubtotalSchema]
  },
  LegalMonetaryTotal: {
    LineExtensionAmount: {
      val: Number
    },
    TaxInclusiveAmount: {
      val: Number
    },
    AllowanceTotalAmount: {
      val: Number
    },
    ChargeTotalAmount: {
      val: Number
    },
    PrepaidAmount: {
      val: Number
    },
    PayableAmount: {
      val: Number
    },
  },
  InvoiceLine: [invoiceInlineSchema],
  sumValues: {}
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
