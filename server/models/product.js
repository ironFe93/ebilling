// grab the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const productSchema = new Schema({
  cod_medida: String, //11
  descripcion: String, //13
  ref_price: Number,
  inventario: {
    cantidad: {type: Number, min:0 }
  }
});

// the schema is useless so far
// we need to create a model using it
var Product = mongoose.model('Product', productSchema);

// make this available to our users in our Node applications
module.exports = Product;