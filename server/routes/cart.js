const express = require('express');
const routes = express.Router();

var Cart = require('../models/cart');

function handleError(error) {
    console.log(error);
};

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'carts!' });
});

// Create a cart
routes.post('/create', (req, res) => {
    var newCart = new Cart({ status: req.body.status});
    
    newCart.save(function (err) {
        if (err) return handleError(err);
        // saved!
    })

    res.send(newCart);
});

// Add a product to a cart
    routes.post('/add', (req, res) => {
        
        

    });



module.exports = routes;