const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taxSubTotalSchema = new Schema({
    TaxableAmount: {
        att: {
            currencyID: { type: String, enum: ["PEN", "USD"] },
        },
        val: Number
    },
    TaxAmount: {
        att: {
            currencyID: { type: String, enum: ["PEN", "USD"] },
        },
        val: Number
    },
    TaxCategory: {
        ID: {
            att: {
                schemeID: { type: String, default: "UN/ECE 5305" },
                schemeName: { type: String, default: "Tax Category Identifier" },
                schemeAgencyName: { type: String, default: "United Nations Economic Commission for Europe" }
            },
            val: { type: String, enum: ["S", "E", "O"] }
        },
        TaxScheme: {
            ID: {
                att: {
                    schemeID: { type: String, default: "UN/ECE 5305" },
                    schemeAgencyID: { type: Number, default: 6 }
                },
                val: { type: Number, enum: [1000, 9996, 9997, 9998] }
            },
            Name: { type: String, enum: ["IGV", "EXONERADO", "INAFECTO", "GRATUITO"] },
            TaxTypeCode: { type: String, enum: ["VAT", "FRE"] }
        }
    }
});

const TaxSubTotal = mongoose.model("TaxSubTotal", taxSubTotalSchema);
module.exports = TaxSubTotal;