const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taxSubTotalSchema = new Schema({
    TaxableAmount:  {type: Number, set: v => v.toFixed(2)},
    TaxAmount: {type: Number, set: v => v.toFixed(2)},
    TaxCategory: {
        TaxSchemeID: Number
    }
});

const TaxSubTotal = mongoose.model("TaxSubTotal", taxSubTotalSchema);
module.exports = TaxSubTotal;