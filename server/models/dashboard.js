var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dashboardSchema = new Schema({
  model: String,
  reference: String,
  subject: String
});

var Dashboard = mongoose.model('Dashboard', dashboardSchema);
module.exports = Dashboard;