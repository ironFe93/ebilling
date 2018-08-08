var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterSchema = new Schema({
    _id: String,
    desc: String,
    ser: {type: Number, max: 999},
    seq: {type: Number, max: 99999999},
    prefix: String,
    letter: String
});

var Counters = mongoose.model('Counters', counterSchema);

module.exports = Counters;