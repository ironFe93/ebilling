const mongoose = require("mongoose");
const catalogSchema = new mongoose.Schema({}, {strict: false});
const Catalog = mongoose.model('Catalogs', catalogSchema);

module.exports = Catalog;