// grab the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const productSchema = new Schema({
  sku: {type: String, required: true, unique:true},
  type: {type: String, index: true},
  title: {type: String, index: true},
  description: { type: String, index: true},
  pricing: {
    list: Number,
    retail: Number,
    savings: Number,
    pct_savings: Number
  },
  inventory: {
    qty: {
      type: Number,
      min: [0, 'Inventory cant be negative']
    },
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