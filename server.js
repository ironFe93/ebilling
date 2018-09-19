// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

mongoose_options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
}
// Conect MongoDB
mongoose.connect(process.env.MONGODB_URI, mongoose_options)
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

// cors
if(app.get('env')=== 'development'){
  const corsOptions = {
    origin: 'http://localhost:4200'
  }
  app.use(cors(corsOptions))
}

// passport
passport = require('./server/config/passport-config');
app.use(passport.initialize());

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


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function (err, req, res, next) {
    res.status(err.status || 500).send(err.toString());
  });

} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    err.message = 'Error en el servidor';
    res.status(err.status || 500).send(err.toString);
  });
}

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || process.env.DEV_PORT;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
  console.log(`API running on localhost:${port}`);
});

