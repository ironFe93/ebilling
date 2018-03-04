// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var inboundInvSchema = new Schema({
  status: String, //pending, partial or complete
  sku: String,
  qty: Number,
  title: String,
  reception: [{
    scheduled_qty: Number, //can't exceed qty; 
    scheduled_arrival: Date,
    arrival_date: Date, //null means arrival is pending
    arrival_qty: Date, //control value. ideally should be equal to scheduled_qty
    arrival_approval: Boolean, //to reject unacceptabe items.
    arrival_details: String
  }],
  purchase: String
});


// the schema is useless so far
// we need to create a model using it
var InboundInventory = mongoose.model('InboundInventory', inboundInvSchema);

// make this available to our users in our Node applications
module.exports = InboundInventory;