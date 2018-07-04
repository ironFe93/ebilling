var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var purchaseInvoiceSchema = new Schema({
  date: {type: Date, default: Date.now},
  provider: String,
  ruc: Number,
  status: {type: String, default: 'complete' },
  items: [{
    sku: String,
    qty: Number,
    title: String
  }]
});

var PurchaseInvoice = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema);
module.exports = PurchaseInvoice;