// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema ({
    sku: String,
    qty: Number,
    item_details: String
});

var Item = mongoose.model('Item', itemSchema);

// make this available to our users in our Node applications
module.exports = Item;