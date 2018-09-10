const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceInlineSchema = new Schema({
    ID: Number,
    InvoicedQuantity: {
        att: {
            unitCode: String
        },
        val: Number
    },
    LineExtensionAmount: {
        att: {
            currencyID: {type: String, enum: ["PEN", "USD"]}
        },
        val: Number
    },
    PricingReference: {
        AlternativeConditionPrice: {
            PriceAmount: {
                att: {
                    currencyID: {type: String, enum:["PEN", "USD"]}
                },
                val: Number
            },
            PriceTypeCode: {
                att: {
                    listName: {type: String, default: "SUNAT:Indicador de Tipo de Precio"},
                    listAgencyName: {type: String, default: "PE:SUNAT"},
                    listURI: {type: String, default:"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"}
                },
                val: {type: String, enum:["01", "02"]}
            }
        }
    },
    AllowanceCharge: {
        ChargeIndicator: Boolean,
        AllowanceChargeReasonCode: String,
        MultiplierFactorNumeric: Number,
        Amount: {
            att: {
                currencyID: {type: String, enum:["PEN", "USD"]}
            },
            val: Number
        },
        BaseAmount: {
            att: {
                currencyID: {type: String, enum:["PEN", "USD"]}
            },
            val: Number
        }
    },
    TaxTotal: {
        TaxAmount: {
            att: {
                currencyID: {type: String, enum: ["PEN", "USD"]}
            },
            val: Number
        },
        TaxSubtotal: {
            TaxableAmount: {
                att: {
                    currencyID: {type: String, enum:["PEN", "USD"]}
                },
                val: Number
            },
            TaxAmount: {
                att: {
                    currencyID: {type: String, enum:["PEN", "USD"]},
                },
                val: Number
            },
            TaxCategory: {
                ID: {
                    att: {
                        schemeID: {type: String, default:"UN/ECE 5305"},
                        schemeName: {type: String, default:"Tax Category Identifier"},
                        schemeAgencyName: {type: String, default:"United Nations Economic Commission for Europe"}
                    },
                    val: {type: String, enum:["S", "E", "O"]}
                },
                TaxExemptionReasonCode: {
                    att: {
                        listAgencyName: {type: String, default:"PE:SUNAT"},
                        listName: {type: String, default:"Codigo de Tipo de Afectación del IGV"},
                        listURI: {type: String, default:"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"}
                    },
                    val: {type: Number, enum:[10, 20, 30]}
                },
                TaxScheme: {
                    ID: {
                        att: {
                            schemeID: {type: String, default:"UN/ECE 5153"},
                            schemeName: {type: String, default:"Tax Scheme Identifier"},
                            schemeAgencyID: {type: Number, default:6}
                        },
                        val: {type: Number, enum:[1000, 9996, 9997, 9998]}
                    },
                    Name: {type: String, enum:["IGV", "EXONERADO", "INAFECTO", "GRATUITO"]},
                    TaxTypeCode: {type: String, enum:["VAT", "FRE"]}
                }
            }
        }
    },
    Item: {
        Description: String,
        SellersItemIdentification: {
            ID: String
        }
    },
    Price: {
        PriceAmount: {
            att: {
                CurrencyID: {type: String, enum:["PEN", "USD"]}
            },
            val: Number
        }
    }
}
);

const InvoiceInline = mongoose.model("InvoiceInline", invoiceInlineSchema);
module.exports = InvoiceInline;

