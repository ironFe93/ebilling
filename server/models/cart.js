// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// if (ruc) then sale is 'factura', else it's 'boleta'
var cartSchema = new Schema({
  last_modified: Date,
  client:{
    name: String,
    ruc: String,
  },
  status: String,
  grossTotal: Number,
  itemsTotal: Number,
  items: [{
    sku: String,
    qty: Number,
    title: String,
    listPrice: Number
  }]
});


// the schema is useless so far
// we need to create a model using it
var Cart = mongoose.model('Cart', cartSchema);

// make this available to our users in our Node applications
module.exports = Cart;