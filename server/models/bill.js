const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceInlineSchema = require('../models/bill-invoice-inline').schema;
const taxSubTotalSchema = require('../models/tax-subtotal').schema;
//  http:// www.sunat.gob.pe/legislacion/superin/2017/anexoVII-117-2017.pdf

const billSchema = new Schema({
  UBLExtensions: {
    ds_signature: String
  },
  UBLVersionID: { type: Number, default: 2.1 },
  CustomizationID: { type: Number, default: 2.0 },
  ProfileID: {
    att: {
      schemeName: { type: String, default: "SUNAT:Identificador de Tipo de Operación" },
      schemeAgencyName: { type: String, default: "PE:SUNAT" },
      schemeURI: { type: String, default: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo17" }
    },
    val: { type: String, default: "0101" }
  },
  ID: String,
  IssueDate: Date,
  cond_pago: Number,
  IssueTime: Date,
  DueDate: Date,
  InvoiceTypeCode: {
    att: {
      listAgencyName: { type: String, default: "PE:SUNAT" },
      listName: { type: String, default: "SUNAT:Identificador de Tipo de Documento" },
      listURI: { type: String, default: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01" },
    },
    val: { type: Number, default: 1 }
  },
  Note: {
    att: {
      languageLocaleID: { type: String, default: "1000" }
    },
    val: String
  },
  DocumentCurrencyCode: {
    att: {
      listID: { type: String, default: "ISO 4217 Alpha" },
      listName: { type: String, default: "Currency" },
      listAgencyName: { type: String, default: "United Nations Economic Commission for Europe" },
    },
    val: { type: String, enum: ["PEN", "USD"] }
  },
  ////////
  DespatchDocumentReference: {
    ID: String,
    DocumentTypeCode: {
      att: {
        listAgencyName: { type: String, default: "PE:SUNAT" },
        listName: { type: String, default: "Identificador de guía relacionada" },
        listURI: { type: String, default: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01" },
      },
      val: { type: Number, enum: [9] }
    }
  },
  AdditionalDocumentReference: {
    ID: String,
    DocumentTypeCode: {
      att: {
        listAgencyName: { type: String, default: "PE:SUNAT" },
        listName: { type: String, default: "Identificador de documento relacionado" },
        listURI: { type: String, default: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo12" },
      },
      val: Number
    }
  },
  AccountingSupplierParty: {
    Party: {
      PartyName: {
        Name: String // nombre comercial
      },
      PartyTaxScheme: {
        RegistrationName: String, // razon social
        CompanyID: {
          att: {
            schemeID: { type: Number, default: 6 },
            schemeName: { type: String, default: "SUNAT:Identificador de Documento de Identidad" },
            schemeAgencyName: { type: String, default: "PE:SUNAT" },
            schemeURI: { type: String, default: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06" }
          },
          val: Number // RUC
        },
        TaxScheme: {
          ID: { type: String, default: "-" }
        },
        RegistrationAddress: {
          AddressTypeCode: { type: String, default: "0001" }
        }
      }
    }
  },
  AccountingCustomerParty: {
    Party: {
      PartyTaxScheme: {
        RegistrationName: String, // razon social
        CompanyID: {
          att: {
            schemeID: { type: Number, default: 6 },
            schemeName: { type: String, default: "SUNAT:Identificador de Documento de Identidad" },
            schemeAgencyName: { type: String, default: "PE:SUNAT" },
            schemeURI: { type: String, default: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06" }
          },
          val: Number // RUC
        },
        TaxScheme: {
          ID: { type: String, default: "-" }
        }
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
    AllowanceChargeReasonCode: Number,
    MultiplierFactorNumeric: Number,
    Amount: {
      att: {
        currencyID: { type: String, enum: ["PEN", "USD"] },
      },
      val: Number
    },
    BaseAmount: {
      att: {
        currencyID: { type: String, enum: ["PEN", "USD"] },
      },
      val: Number
    }
  },
  TaxTotal: {
    TaxAmount: {
      att: {
        currencyID: { type: String, enum: ["PEN", "USD"] },
      },
      val: Number
    }, TaxSubTotal: [taxSubTotalSchema]
  },
  LegalMonetaryTotal: {
    LineExtensionAmount: {
      att: {
        currencyID: { type: String, enum: ["PEN", "USD"] }
      },
      val: Number
    },
    TaxInclusiveAmount: {
      att: {
        currencyID: { type: String, enum: ["PEN", "USD"] }
      },
      val: Number
    },
    AllowanceTotalAmount: {
      att: {
        currencyID: { type: String, enum: ["PEN", "USD"] }
      },
      val: Number
    },
    ChargeTotalAmount: {
      att: {
        currencyID: { type: String, enum: ["PEN", "USD"] }
      },
      val: Number
    },
    PrepaidAmount: {
      att: {
        currencyID: { type: String, enum: ["PEN", "USD"] }
      },
      val: Number
    },
    PayableAmount: {
      att: {
        currencyID: { type: String, enum: ["PEN", "USD"] }
      },
      val: Number
    },
  },
  InvoiceInline: [invoiceInlineSchema],
  sumValues: {}
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
