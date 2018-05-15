// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//As a schema, this one represents the purchase orders that are then sent to the providers. 
//It should be different
//than an actual purchase, since not all items will always be fulfilled.

// create a schema
var purchaseOrderSchema = new Schema({
  date_placed: {type: Date, default: Date.now},
  date_sent: Date,
  provider: String,
  status: {type: String, default: 'open' },
  items: [{
    sku: String,
    qty: Number,
    title: String
  }]
});

var PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
module.exports = PurchaseOrder;