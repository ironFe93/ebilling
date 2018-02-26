const routes = require('express').Router();

const product = require('./product');
const cart = require('./cart');
const auth = require('./auth');

const passport = require('../config/passport-config');

routes.get('/',  (req, res, next) => {
    res.status(200).json({ message: 'Connected!' });
  });

routes.use('/product', passport.authenticate('jwt', { session: false }), product);
routes.use('/cart', passport.authenticate('jwt', { session: false }), cart);
routes.use('/auth', auth)

module.exports = routes;