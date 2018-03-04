// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

////this schema represents the actual invoice and payment transaction.

// create a schema
var purchaseSchema = new Schema({
  purchaseOrder: String,
  provider: String,
  payment: {
    invoice: String,
    invoiceUrl: String,
    date: Date, //null means payment is pending
    total: Number,
    discount: Number,
    grossTotal: Number,
    method: String,
    method_reference: String
  },
  status_items: String,
  items: [{
    sku: String,
    qty: Number,
    title: String
  }]
});


// the schema is useless so far
// we need to create a model using it
var Purchase = mongoose.model('Purchase', purchaseSchema);

// make this available to our users in our Node applications
module.exports = Purchase;