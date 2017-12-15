const express = require('express');
const routes = express.Router();

var Product = require('../models/product');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Products!' });
});

// Get all products
routes.get('/findall', (req, res) => {
    // Get posts from the mock api
    // This should ideally be replaced with a service that connects to MongoDB

    Product.find({}, function (err, products) {
        if (err) throw err;

        // object of all the users
        console.log(products);
        res.send(products);
    });
});

// Get by SKU
routes.get('/findsku/:sku', (req, res) => {

    var sku = req.params.sku

    Product.find({'sku': sku}, function (err, products) {
        if (err) throw err;

        // object of all the users
        console.log(products);
        res.send(products);
    });
});

module.exports = routes;