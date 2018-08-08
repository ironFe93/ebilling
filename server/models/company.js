var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
  _id: String,
  registration_name: String,
  comercial_name: String,
  fiscal_address:{
    postal_id: Number,
    street_name: String,
    urban_area: String,
    city: String,
    state: String,
    district: String,
    country_id: {type: String, default:'PE'}
  },
  ruc:{
    number: Number,
    type: {type: Number, default: 6}
  },
  email: String,
  phone: [],
  type: String //Owner, Provider or Client
});

var Company = mongoose.model('Company', companySchema, 'company');

module.exports = Company;