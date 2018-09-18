const routes = require('express').Router();

const product = require('./product');
const billing = require('./billing');
const dashboard = require('./dashboard');
const auth = require('./auth');

const passport = require('../config/passport-config');

routes.get('/',  (req, res, next) => {
    res.status(200).json({ message: 'Connected!' });
  });

routes.use('/product', passport.authenticate('jwt', { session: false }), product);
//routes.use('/bill', passport.authenticate('jwt', { session: false }), billing);
routes.use('/bill', billing);
routes.use('/dashboard', dashboard ); //must have auth control. 
routes.use('/auth', auth);

module.exports = routes;
