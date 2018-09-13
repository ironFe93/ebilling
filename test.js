const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'slick';

(async function() {
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
})();