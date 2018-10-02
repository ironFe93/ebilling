const mongoose = require('mongoose');

mongoose_options = {
    useNewUrlParser: true,
    //reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
}

// Conect MongoDB
mongoClient = mongoose.connect(process.env.MONGODB_URI, mongoose_options)
.then(db => {
  console.log('connection successful');
  return db.connection.client;
})
.catch((err) => console.error(err));

module.exports = mongoClient;