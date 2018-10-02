const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-mongodb').MongoDB;

expressLogger = expressWinston.logger({
    transports: [
        new winston.transports.MongoDB({
            db: process.env.MONGODB_URI,
            collection: 'logs',
            level: 'silly',
            handleExceptions: true,
            options: {useNewUrlParser: true}
        })
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true
})

errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.MongoDB({
            db: process.env.MONGODB_URI,
            collection: 'logs',
            level: 'silly',
            handleExceptions: true,
            options: {useNewUrlParser: true}
        })
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true
})

module.exports = expressLogger;
module.exports = errorLogger;