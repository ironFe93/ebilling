const winston = require('winston');
require('winston-mongodb').MongoDB;
mongoClient = require('./persistance');

/* { 
    error: 0, 
    warn: 1, 
    info: 2, 
    verbose: 3, 
    debug: 4, 
    silly: 5 
  } logging levels for NPM */

const logger = winston.createLogger({level: 'silly'});

if (process.env.DEV_PORT) {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
}

logger.add(new winston.transports.MongoDB({
    db: mongoClient,
    collection: 'logs',
    handleExceptions: true
}));

module.exports = logger;