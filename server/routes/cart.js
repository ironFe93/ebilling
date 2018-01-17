const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

var Product = require('../models/product');
var Item = require('../models/item');
var Cart = require('../models/cart');

routes.get('/', (req, res, next) => {
    res.status(200).json({ message: 'carts!' });
});

// Create a cart
routes.post('/create', celebrate(
    {
        body: Joi.object().keys({
            status: Joi.string().required()
        })
    }
), (req, res, next) => {
    var newCart = new Cart({ status: req.body.status, grossTotal: 0, itemsTotal: 0 });

    newCart.save(function (err, cart) {
        if (err) {
            return next(err)
        } else {
            res.send(cart);
        };
    });


});

// Add a product to a cart
//Joi validation with Celebrate libary
routes.put('/add', celebrate(
    {
        body: Joi.object().keys({
            cartId: Joi.string().required(),
            sku: Joi.string().required(),
            quantity: Joi.number().integer().positive().required(),
            title: Joi.string().required()
        })
    }
), (req, res, next) => {

    //get the cartID
    var id = req.body.cartId;

    //get the rest of the data
    var p_sku = req.body.sku;
    var quantity = req.body.quantity;
    var p_title = req.body.title;

    Product.findOneAndUpdate(
        { 'sku': p_sku, 'inventory.qty': { '$gte': quantity } },
        {
            $inc: {
                "inventory.qty": -quantity
            }, $push: {
                "inventory.carted":
                    {
                        cart_id: id,
                        qty: quantity,
                        timestamp: Date.now()
                    }
            }

        },
        'pricing.list inventory.qty',
        function (err, product) {
            if (err) return next(err);

            if (product) {
                p_price = product.pricing.list;
            } else {
                return next(new Error("Invalid SKU or not enough inventory"));
            }

            console.log("product was found with enough inventory.");

            //Update the cart then send it back but only if status is active. else return error message.
            Cart.findOneAndUpdate(
                { "_id": id, "status": "active", "items.sku": { $ne: p_sku } },
                { $push: { items: { sku: p_sku, qty: quantity, listPrice: p_price, title: p_title } } },
                { safe: true, upsert: false, new: true },
                function (err, cart) {
                    if (err) return next(err);

                    if (cart) {
                        res.send(cart);
                    } else {
                        return next(new Error("Cart is not active, doesn't exist or item already exists in cart"));
                    }

                }
            );
        });
});

// +1 to a product in a cart
routes.put('/deltaOne', celebrate(
    {
        body: Joi.object().keys({
            cartId: Joi.string().required(),
            sku: Joi.string().required(),
            operation: Joi.string().required()
        })
    }
), (req, res, next) => {

    //get the cartID and product SKU
    id = req.body.cartId;
    var sku = req.body.sku;

    var qty = 1;

    if (req.body.operation === 'substract') qty = -1;

    //check stock, for the 'add' case
    Product.findOneAndUpdate(
        { 'sku': sku, 'inventory.qty': { '$gte': qty } },
        {
            $inc: {
                "inventory.qty": -qty
            }
        },
        'sku inventory.qty',
        function (err, product) {
            if (err) throw next(err);
            if (!product) {
                throw next(new Error("Invalid SKU or not enough inventory"));
            }
        }
    );

    console.log("product was found with enough inventory.");

    //Update the cart then send it back
    //https://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument
    Cart.findOneAndUpdate(
        { "_id": id, "items.sku": sku },
        {
            $inc: {
                "items.$.qty": qty
            }
        },
        { safe: true, upsert: false, new: true },
        function (err, cart) {
            if (err) return next(err);
            if (cart) {
                res.send(cart);
            } else {
                next(new Error("No Update: Cart doesn't exist or item not in cart."));
            }

        }
    );
});


// remove a product in a cart
routes.put('/remove', celebrate(
    {
        body: Joi.object().keys({
            cartId: Joi.string().required(),
            sku: Joi.string().required()
        })
    }
), (req, res, next) => {

    //get the cartID and product SKU
    var id = req.body.cartId;
    var sku = req.body.sku;

    //Update the cart then send it back
    //https://stackoverflow.com/questions/15323422/mongodb-cannot-apply-pull-pullall-modifier-to-non-array-how-to-remove-array-e
    Cart.findOneAndUpdate(
        { "_id": id, "items.sku": sku },
        {
            $pull: {
                "items": {
                    "sku": sku
                }
            }
        },
        { safe: true, upsert: false, new: true },
        function (err, cart) {
            if (err) return next(err);
            if (cart) {
                res.send(cart);
            } else {
                next(new Error("No Remove: Cart doesn't exist or item not in cart."));
            }
        }
    );
});

// complete checkout
routes.put('/completeCheckout', celebrate(
    {
        body: Joi.object().keys({
            cartId: Joi.string().required()
        })
    }
), (req, res, next) => {

    var id = req.body.cartId;

    //Update the cart then send it back
    Cart.findOneAndUpdate(
        { "_id": id },
        {
            $set:{status:"complete"}
        },
        { safe: true, new: true },
        function (err, cart) {
            if (err) return next(err);
            if (cart.status == "complete") {
                res.send(cart);
            } else {
                next(new Error("No Checkout: Cart doesn't exist or is no longer active."));
            }
        }
    );


});

module.exports = routes;