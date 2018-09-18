const mongoose = require("mongoose");
const certificateSchema = new mongoose.Schema({
    certPFX: String
});
const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;