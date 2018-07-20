var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterSchema = new Schema({
    _id: String,
    ser: Number, max: 999,
    seq: Number, max: 99999999
});

var Counters = mongoose.model('Counters', counterSchema);

module.exports = Counters;