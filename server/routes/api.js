const routes = require('express').Router();

const product = require('./product');
const cart = require('./cart');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
  });

routes.use('/product', product);
routes.use('/cart', cart);

module.exports = routes;