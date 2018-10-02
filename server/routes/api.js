const routes = require('express').Router();
const product = require('./product');
const billing = require('./billing');
const auth = require('./auth');

const passport = require('../config/passport-config');

if(process.env.DEV_PORT){
    const testRoute = require('./testRoute');
    routes.use('/testing', testRoute);
}

routes.use('/product', passport.authenticate('jwt', { session: false }), product);
routes.use('/bill', /* passport.authenticate('jwt', { session: false }), */ billing);
routes.use('/auth', auth);

module.exports = routes;
