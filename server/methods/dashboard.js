'use strict';
const Dashboard = require('../models/dashboard');

exports.findOrCreate = async (model, reference, subject, next) => {
  let document;
  const query = Dashboard.findOneAndUpdate(
    { reference: reference },
    {
      $setOnInsert: { 'model': model, 'reference': reference, 'subject': subject }
    },
    { upsert: true, passRawResult: true, new: true}
  );

  const result = await query.exec((err, result, raw) => {
    console.log('doc: ' + result);
    console.log('raw: ' + raw.lastErrorObject.updatedExisting);
    if (err) return next(err);
    if (!raw.lastErrorObject.updatedExisting) document = result;
  });
  
  return document;
};

exports.emit = (req) => {
  const io = req.app.get('socketio');
  io.emit('dashboard', reg);
}
