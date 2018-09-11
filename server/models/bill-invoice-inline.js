const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceLineSchema = new Schema({
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
                TaxExemptionReasonCode: Number,
                TaxSchemeID: Number
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

const InvoiceLine = mongoose.model("InvoiceLine", invoiceLineSchema);
module.exports = InvoiceLine;

