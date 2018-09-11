const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceInlineSchema = new Schema({
    ID: Number,
    InvoicedQuantity: {
        unitCode: String,
        val: Number
    },
    LineExtensionAmount: Number,
    PricingReference: {
        AlternativeConditionPrice: {
            PriceAmount: Number,
            PriceTypeCode: { type: String, enum: ["01", "02"] }
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
        TaxSubtotal: {
            TaxableAmount: Number,
            TaxAmount: Number,
            TaxCategory: {
                ID: { type: String, enum: ["S", "E", "O"] },
                TaxExemptionReasonCode: { type: Number, enum: [10, 20, 30] },
                TaxScheme: {
                    ID: { type: Number, enum: [1000, 9996, 9997, 9998] },
                    Name: { type: String, enum: ["IGV", "EXONERADO", "INAFECTO", "GRATUITO"] },
                    TaxTypeCode: { type: String, enum: ["VAT", "FRE"] }
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
        PriceAmount: Number
    }
});

const InvoiceInline = mongoose.model("InvoiceInline", invoiceInlineSchema);
module.exports = InvoiceInline;

