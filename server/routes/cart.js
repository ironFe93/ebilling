const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

const Product = require('../models/product');
const Item = require('../models/item');
const Cart = require('../models/cart');

const dboard = require('../methods/dashboard');

routes.get('/', (req, res, next) => {
    res.status(200).json({ message: 'carts!' });
});

// get a list of carts
routes.get('/get/:_id', (req, res, next) => {
    Cart.find({ '_id': req.params._id }, '_id status', function (err, carts) {
        if (err) return next(err);
        res.send(carts);
    });
});

// get a cart
routes.get('/getDetail/:_id', (req, res, next) => {

    Cart.findById(req.params._id, (err, cart) => {
        if (err) return next(err);
        res.send(cart);
    });
});

// Create a cart
routes.post('/create', (req, res, next) => {
    const newCart = new Cart({ status: 'active', grossTotal: 0, itemsTotal: 0 });
    
    newCart.save((err, cart) => {
        if (err) return next(err);
        if (!cart) return next(new Error('Error creating cart'));
        res.send(cart);
    });
});

// Add a product to a cart OPTIMIZE THIS ROUTE BY LOOKING FOR DUPES FIRST THEN EXTRACTING INVENTORY
// Joi validation with Celebrate libary
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

    const id = req.body.cartId;
    const p_sku = req.body.sku;
    const quantity = req.body.quantity;
    const p_title = req.body.title;

    Product.findOneAndUpdate(
        { 'sku': p_sku, 'inventory.qty': { '$gte': quantity } },
        {
            $inc: {
                'inventory.qty': -quantity
            }, $push: {
                'inventory.carted':
                    {
                        cart_id: id,
                        qty: quantity,
                        timestamp: Date.now()
                    }
            }

        },
        'pricing.list inventory.qty',
        (err, product) => {
            if (err) return next(err);
            let p_price;
            if (product) {
                p_price = product.pricing.list;
            } else {
                return next(new Error('Not enough inventory'));
            }

            console.log('product was found with enough inventory.');

            // Update the cart then send it back but only if status is active. else return error message.
            Cart.findOneAndUpdate(
                { '_id': id, 'status': 'active', 'items.sku': { $ne: p_sku } },
                { $push: { items: { sku: p_sku, qty: quantity, listPrice: p_price, title: p_title } } },
                { safe: true, upsert: false, new: true },
                (error, cart) => {
                    if (error) return next(error);

                    if (cart) {
                        res.send(cart);
                    } else {
                        // cart is expired => return inventory
                        returnInventory(p_sku, quantity, id, next);
                        return next(new Error('Cart is expired'));
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
    // get the cartID and product SKU
    const id = req.body.cartId;
    const sku = req.body.sku;
    let qty = 1;

    if (req.body.operation === 'substract') qty = -1;

    // check stock, for the 'add' case
    Product.findOneAndUpdate(
        { 'sku': sku, 'inventory.qty': { '$gte': qty } },
        {
            $inc: {
                'inventory.qty': -qty
            }
        },
        'sku inventory.qty',
        (err, product) => {
            if (err) return next(err);
            if (!product) {
                return next(new Error('Invalid SKU or not enough inventory'));
            }
        }
    );

    console.log('product was found with enough inventory.');

    // Update the cart then send it back
    // https://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument
    Cart.findOneAndUpdate(
        { '_id': id, 'items.sku': sku },
        {
            $inc: {
                'items.$.qty': qty
            }
        },
        { safe: true, upsert: false, new: true },
        (err, cart) => {
            if (err) return next(err);
            if (cart) {
                res.send(cart);
            } else {
                next(new Error('No Update: Cart does not exist or item not in cart.'));
            }

        }
    );
});


// remove a product in a cart. Lacks: add inventory back to product.
routes.put('/remove', celebrate(
    {
        body: Joi.object().keys({
            cartId: Joi.string().required(),
            sku: Joi.string().required()
        })
    }
), (req, res, next) => {

    // get the cartID and product SKU
    const id = req.body.cartId;
    const sku = req.body.sku;

    // Update the cart then send it back
    // https://stackoverflow.com/questions/15323422/mongodb-cannot-apply-pull-pullall-modifier-to-non-array-how-to-remove-array-e
    Cart.findOneAndUpdate(
        { '_id': id, 'items.sku': sku },
        {
            $pull: {
                'items': {
                    'sku': sku
                }
            }
        },
        { safe: true, upsert: false, new: true },
        (err, cart) => {
            if (err) return next(err);
            if (cart) {
                res.send(cart);
            } else {
                next(new Error('No Remove: Cart does not exist or item not in cart.'));
            }
        }
    );
});

// complete checkout
routes.put('/completeCheckout', celebrate(
    {
        body: Joi.object().keys({
            cartId: Joi.string().required(),
            ruc: Joi.string().required(),
            rs: Joi.string().required(),
        })
    }
), (req, res, next) => {

    const id = req.body.cartId;
    const ruc = req.body.ruc;
    const rs = req.body.rs;


    // Update the cart then send it back
    Cart.findOneAndUpdate(
        { '_id': id },
        {
            $set: { status: 'complete' , ruc: ruc, rs: rs }
        },
        { safe: true, new: true },
        (err, cart) => {
            if (err) return next(err);
            if (cart.status === 'complete') {
                res.send(cart);
            } else {
                next(new Error('No Checkout: Cart does not exist or is no longer active.'));
            }
        }
    );

    // check inventory level of products
    Product.find(
        { 'inventory.carted.cart_id': id, 'inventory.qty': {'$lte': 10} },
        (err, lowInvArray) => {
            if (err) return next(err);
            if (lowInvArray) {
                lowInvArray.forEach(
                    async lowInvProd => {
                        const reg = await dboard.findOrCreate('products', lowInvProd._id,
                        'low inventory', next, lowInvProd.title, lowInvProd.sku);
                        if (reg) dboard.emit(req);
                    }
                );
            }
        },
    );

    // remove cart from inventory.carted array
    Product.update(
        { 'inventory.carted.cart_id': id },
        {
            $pull: {
                'inventory.carted': {
                    'cart_id': id
                }
            }
        }, (err) => {
            if (err) return next(err);
        }
    );


});

routes.put('/expire', celebrate(
    {
        body: Joi.object().keys({
            cartId: Joi.string().required()
        })
    }
), (req, res, next) => {
    expireCart(req.cartId, next);
});

const expireCart = (id, next) => {
    // Set status as expired
    Cart.findOneAndUpdate(
        {'_id': id, 'status':  { $ne: 'complete'}},
        {
            $set: { status: 'expired' }
        },
        (err, resp) => {
            if (err) return next(err);
            if (resp) {
                const cart = resp;
                // for each item in the cart, return inventory
                cart.items.forEach(item => returnInventory(item.sku, item.qty, cart._id, next));
            } else {
                return next(new Error('Expired cart ID not found or cart is complete'));
            }
        }
    );
};

const returnInventory = (sku, qty, id, next) => Product.findOneAndUpdate(
    { 'sku': sku },
    {
        $inc: {
            'inventory.qty': + qty
        },
        $pull: {
            'inventory.carted': {
                'cart_id': id
            }

        }
    }, err => { if (err) return next(err); }
);

module.exports = routes;
