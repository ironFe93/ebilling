const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taxSubTotalSchema = new Schema({
    TaxableAmount:  Number,
    TaxAmount:  Number,
    TaxCategory: {
        TaxSchemeID: Number 
    }
});

const TaxSubTotal = mongoose.model("TaxSubTotal", taxSubTotalSchema);
module.exports = TaxSubTotal;