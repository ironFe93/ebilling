const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const fs = require('fs')

//read the file
const file_buffer = fs.readFileSync('./server/files/cert.pfx');
//encode contents into base64
const contents_in_base64 = file_buffer.toString('base64');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'slick';

(async function () {
  try {

    const client = await MongoClient.connect(url);
    console.log("Connected correctly to server");
    const db = client.db(dbName);

    // Get the updates collection
    const col = db.collection('certificate');

    // Insert a single document
    r = await col.insertOne({ certPFX: contents_in_base64 });

    // Close connection
    client.close();
  } catch (err) {
    console.log(err.stack);
  }
})();

/* (async function() {
  try {
    const client = await MongoClient.connect(url);
    console.log("Connected correctly to server");
    const db = client.db(dbName);

    // Get the updates collection
    const col = db.collection('products');

    // Insert a single document
    r = await col.updateMany({}, {$set: {cod_medida: "NIU"}});
    assert.equal(47, r.matchedCount);
    assert.equal(47, r.modifiedCount);

    // Close connection
    client.close();
  } catch(err) {
    console.log(err.stack);
  }
})(); */