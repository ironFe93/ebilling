const mongoose = require("mongoose");
const certificateSchema = new mongoose.Schema({
    certPFX: String
}, {strict: false});
const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;