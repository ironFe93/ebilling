'use strict';
const Dashboard = require('../models/dashboard');

exports.findOrCreate = async (model, reference, subject, next, title, sku ) => {
  let insertData = {'model':model, 'reference':reference, 'subject':subject }
  if(model === 'Products'){
    insertData = {'model':model, 'reference':reference, 'subject':subject, 'title':title, 'sku': sku };
  }
  let document;
  const query = Dashboard.findOneAndUpdate(
    { reference: reference },
    {
      $setOnInsert: insertData
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
