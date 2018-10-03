// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const cors = require('cors');
const debug = require('debug')('Slick');
const name = 'E-Billing';

debug('booting %s', name);

mongoClient = require('./server/modules/persistance'); //initialize mongoconnection with mongoose
mongoClient.then(() => {
  require('./server/modules/logger'); //initialize logger after db connection resolves
}).catch((err) => console.error(err))

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

//expressLogger before API routes
const expressLogger = require('./server/modules/expressLogger');
app.use(expressLogger);

// Get our API routes and set them
const api = require('./server/routes/api');
app.use('/api', api);

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file. must come last.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//expressLogger after API routes
const errorLogger = require('./server/modules/expressLogger');
app.use(errorLogger);

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
    // LOG ERROR TO DB IN HERE
    //
    err.message = 'Error en el servidor';
    res.status(err.status || 500).send(err.toString());
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