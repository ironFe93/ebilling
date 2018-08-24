var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var certSchema = new Schema({
    "ext:UBLExtensions":{}
});
var Cert = mongoose.model('Cert', certSchema, 'DIGITALCERT');
module.exports = Cert;