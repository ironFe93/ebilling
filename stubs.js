// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'slick';

const string = require('./server/modules/numberToLetter')(96871628.54);
console.log(string);

/* (async function () {
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
 */
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