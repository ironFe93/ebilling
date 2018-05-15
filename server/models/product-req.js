// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//As a schema, this one represents the purchase orders sent to the providers. It should be different
//than an actual purchase, since not all items will always be fulfilled.
//still not sure if grossTotal applies to this shema.

// create a schema
var productReqSchema = new Schema({
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'open' },
  items: [{
    sku: String,
    qty: Number,
    title: String,
    status: {type: String, default: 'pending'}
  }]
});


// the schema is useless so far
// we need to create a model using it
var ProductReq = mongoose.model('ProductReq', productReqSchema);

// make this available to our users in our Node applications
module.exports = ProductReq;