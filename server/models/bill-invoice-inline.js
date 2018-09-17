const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceLineSchema = new Schema({
    ID: Number,
    InvoicedQuantity: {
        unitCode: String,
        val: Number
    },
    LineExtensionAmount: {type: Number, set: v => v.toFixed(2)},
    PricingReference: {
        AlternativeConditionPrice: {
            PriceAmount: Number,
            PriceTypeCode: { type: String, enum: ['01', '02'] }
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
        TaxSubtotal: {
            TaxableAmount: {type: Number, set: v => v.toFixed(2)},
            TaxAmount: {type: Number, set: v => v.toFixed(2)},
            TaxCategory: {
                Percent: Number,
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
        PriceAmount: {type: Number, set: v => v.toFixed(2)}
    }
});

const InvoiceLine = mongoose.model("InvoiceLine", invoiceLineSchema);
module.exports = InvoiceLine;

