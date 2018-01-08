const express = require('express');
const routes = express.Router();

var Product = require('../models/product');
var Item = require('../models/item');
var Cart = require('../models/cart');


function handleError(error) {
    console.log(error);
};

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'carts!' });
});

// Create a cart
routes.post('/create', (req, res) => {
    var newCart = new Cart({ status: req.body.status, grossTotal: 0, itemsTotal: 0 });

    newCart.save(function (err) {
        if (err) return handleError(err);
        // saved!
    })

    res.send(newCart);
});

// Add a product to a cart
routes.put('/add', (req, res) => {
    console.log("add a product!");

    //get the cartID
    id = req.body.cartId;

    //get the rest of the data
    var p_sku = req.body.sku;
    var quantity = req.body.quantity;
    var p_title = req.body.title;

    Product.findOne({ 'sku': p_sku }, 'pricing.list', function (err, product) {
        if (err) return handleError(err);

        p_price = product.pricing.list;

        Cart.findByIdAndUpdate(
            id,
            { $push: { items: { sku: p_sku, qty: quantity, listPrice: p_price, title: p_title } } },
            { safe: true, upsert: true, new: true },
            function (err, cart) {
                if (err) return handleError(err);
                res.send(cart);
            }
        );

    });

    //Update the cart then send it back

   

});

module.exports = routes;