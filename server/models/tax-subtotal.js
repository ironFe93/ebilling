const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taxSubTotalSchema = new Schema({
    TaxableAmount:  Number,
    TaxAmount:  Number,
    TaxCategory: {
        ID: { type: String, enum: ["S", "E", "O"] },
        TaxScheme: {
            ID: { type: Number, enum: [1000, 9996, 9997, 9998] },
            Name: { type: String, enum: ["IGV", "EXONERADO", "INAFECTO", "GRATUITO"] },
            TaxTypeCode: { type: String, enum: ["VAT", "FRE"] }
        }
    }
});

const TaxSubTotal = mongoose.model("TaxSubTotal", taxSubTotalSchema);
module.exports = TaxSubTotal;