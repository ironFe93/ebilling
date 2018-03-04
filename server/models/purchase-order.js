// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//As a schema, this one represents the purchase orders sent to the providers. It should be different
//than an actual purchase, since not all items will always be fulfilled.
//still not sure if grossTotal applies to this shema.

// create a schema
var purchaseOrderSchema = new Schema({
  order_placed: Date,
  order_sent: Date,
  provider: String,
  Status: String,
  items: [{
    sku: String,
    qty: Number,
    title: String
  }],
  grossTotal: Number //not sure tho
});


// the schema is useless so far
// we need to create a model using it
var PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

// make this available to our users in our Node applications
module.exports = PurchaseOrder;