// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Conect MongoDB
mongoose.Promise = global.Promise;
db = mongoose.connect("mongodb://admin:PPEKCJ4236702+@universalcluster0-shard-00-00-dlslo.mongodb.net:27017," +
"universalcluster0-shard-00-01-dlslo.mongodb.net:27018," +
"universalcluster0-shard-00-02-dlslo.mongodb.net:27019," +
"/db_universal?authSource=admin&replicaSet=universalCluster0-shard-0&ssl=true",{ useMongoClient: true });

db.on('error', console.error.bind(console, 'connection error:'));

// Get our API routes
const api = require('./server/routes/api');
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file. must come last.
/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});  */

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));