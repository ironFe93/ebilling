// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//This schema represents the entry of bought items into inventory, but not the actual stock number
// which is mantained in the products collection. 

//status:pending --> item payed, not recevied
//status: partial --> item payed, partially received
//status: complete --> item payed, completely received.

// create a schema
var inboundItemSchema = new Schema({
  status: String, //pending, partial or complete
  sku: String,
  qty: Number,
  qty_expected: Number,
  title: String,
  schedule: [{
    scheduled_qty: Number, //can't exceed qty; 
    scheduled_arrival: Date,
  }],
  reception: [{
    arrival_date: Date, //null means arrival is pending
    arrival_qty: Date, //control value. ideally should be equal to scheduled_qty
    arrival_details: String
  }],
  purchaseId: String
});


// the schema is useless so far
// we need to create a model using it
var InboundItem = mongoose.model('InboundItem', inboundItemSchema);

// make this available to our users in our Node applications
module.exports = InboundItem;