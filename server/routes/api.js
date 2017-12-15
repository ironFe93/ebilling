const routes = require('express').Router();

const product = require('./product');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
  });

routes.use('/product', product);

module.exports = routes;