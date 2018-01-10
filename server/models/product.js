// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var productSchema = new Schema({
  sku: {type: String, required: true, unique:true},
  type: String,
  title: String,
  description: String,
  pricing: {
    list: Number,
    retail: Number,
    savings: Number,
    pct_savings: Number
  },
  inventory: {
    qty: Number,
    carted: [{
      qty: Number,
      cart_id: Schema.Types.ObjectId,
      timestamp: { type: Date, default: Date.now },
    }]
  }

});

// the schema is useless so far
// we need to create a model using it
var Product = mongoose.model('Product', productSchema);

// make this available to our users in our Node applications
module.exports = Product;