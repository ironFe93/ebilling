// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();



// Conect MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:PPEKCJ4236702+@universalcluster0-shard-00-00-dlslo.mongodb.net:27017,' +
  'universalcluster0-shard-00-01-dlslo.mongodb.net:27018,' +
  'universalcluster0-shard-00-02-dlslo.mongodb.net:27019,' +
  '/db_universal?authSource=admin&replicaSet=universalCluster0-shard-0&ssl=true',
  { useMongoClient: true },
  function(error){
    console.error.bind(console, 'connection error:');
  });

// passport
passport = require('./server/config/passport-config');
// import {passport} from './server/config/passport-config';
app.use(passport.initialize());
///////

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get our API routes and set them
const api = require('./server/routes/api');
app.use('/api', api);

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file. must come last.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


// TO DO: https://stackoverflow.com/questions/41133705/how-to-correctly-set-http-request-header-in-angular-2


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function (err, req, res, next) {
    console.log(err.message);
    res.status(err.status || 500).send(err.toString());
  });

}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
});

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
 * Prepare socket.io
 */
let io = require('socket.io')(server);
io.on('connection', socket => {

  socket.emit('message', 'hello from server.js');

});
app.set('socketio', io);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));

