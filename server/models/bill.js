const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceInlineSchema = require('../models/bill-invoice-inline').schema;
const taxSubtotalSchema = require('../models/tax-subtotal').schema;
//  http:// www.sunat.gob.pe/legislacion/superin/2017/anexoVII-117-2017.pdf

const billSchema = new Schema({
  UBLExtensions: {
    ds_signature: String
  },
  UBLVersionID: { type: String, default: "2.1" },
  CustomizationID: {
    att: {
      schemeAgencyName: { type: String, default: "PE:SUNAT" }
    },
    val: { type: String, default: "2.1" },
  },

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
  DueDate: Date,
  InvoiceTypeCode: {
    att: {
      listAgencyName: { type: String, default: "PE:SUNAT" },
      listName: { type: String, default: "SUNAT:Identificador de Tipo de Documento" },
      listURI: { type: String, default: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01" },
    },
    val: { type: String, default: "01" }
  },
  Note: {
    att: {
      // languageLocaleID: { type: String, default: "1000" }
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
      PartyIdentification: {
        ID: {
          att: {
            schemeID: { type: Number, default: 6 },
            schemeName: { type: String, default: "Documento de Identidad" },
            schemeAgencyName: { type: String, default: "PE:SUNAT" },
            schemeURI: { type: String, default: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06" }
          },
          val: Number // RUC
        }
      }, PartyName: {
        Name: String // nombre comercial
      }, PartyLegalEntity: {
        RegistrationName: String,
        RegistrationAddress: {
          AddressLine: {
            Line: String
          },
          CitySubdivisionName: String,
          CityName: String,
          ID: {
            att: {
              schemeAgencyName: { type: String, default: "PE:INEI" },
              schemeName: { type: String, default: "Ubigeos" }
            },
            val: String
          },
          CountrySubentity: String,
          Country: {
            IdentificationCode: {
              att: {
                listID: { type: String, default: "ISO 3166-1" },
                listAgencyName: { type: String, default: "United Nations Economic Comission for Europe" },
                listName: { type: String, default: "Country" }
              },
              val: { type: String, default: "PE" }
            }
          }
        }
      }
    }
  },
  AccountingCustomerParty: {
    Party: {
      PartyIdentification: {
        ID: {
          att: {
            schemeID: { type: Number, default: 6 },
            schemeName: { type: String, default: "Documento de Identidad" },
            schemeAgencyName: { type: String, default: "PE:SUNAT" },
            schemeURI: { type: String, default: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06" }
          },
          val: Number // RUC
        }
      }, PartyName: {
        Name: String // nombre comercial
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
    }, TaxSubtotal: [taxSubtotalSchema]
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
  InvoiceLine: [invoiceInlineSchema],
  sumValues: {}
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
