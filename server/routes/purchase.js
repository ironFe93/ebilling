const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

const Product = require('../models/product');
const Item = require('../models/item');
const Purchase = require('../models/purchase');
const PurchaseOrder = require('../models/purchase-order');
const InboundItem = require('../models/inbound-item');


// get a list of purchases. Method incomplete.
routes.get('/get/:_id', (req, res, next) => {
    Purchase.find({ "_id": req.params._id }, "_id status", function (err, carts) {
        if (err) return next(err);
        res.send(carts);
    });
});

// get a single Purchase with full detail, by id
routes.get('/getDetail/:_id', (req, res, next) => {

    Purchase.findById(req.params._id, (err, cart) => {
        if (err) return next(err);
        res.send(cart);
    });
});

///Create a purchase order. 
routes.post('/registerPurchaseOrder', (req, res, next) => {
    const order = new PurchaseOrder(
        {
            items: req.body.items,
            provider: req.body.provider
        }
    );
    order.save((err, order) => {
        if (err) return next(err);
        if (order) {
            res.send(order);
        } else {
            return next(new Error("purchase order creation failed"))
        }
    });
});

// Get Req by searchTerms
routes.get('/findPO', (req, res, next) => {
    const datePlaced1 = new Date(req.query.datePlaced1);
    const datePlaced2 = new Date(req.query.datePlaced2);
    const dateSent1 = new Date(req.query.dateSent1);
    const dateSent2 = new Date(req.query.dateSent2);
    const sku = req.query.sku;
    const string = req.query.string;
    const status = req.query.status;
    const provider = req.query.provider;

    var query = PurchaseOrder.find();

    if(checkIfDateValid(datePlaced1)) query.where('date_placed').gte(datePlaced1);
    if(checkIfDateValid(datePlaced2)) query.where('date_placed').lte(datePlaced2);
    if(checkIfDateValid(dateSent1)) query.where('date_sent').gte(dateSent1);
    if(checkIfDateValid(dateSent2)) query.where('date_sent').lte(dateSent2);
    if(sku) query.where({ 'items.sku': sku });
    if(string) query.where({ 'items.title': string });
    if(status) query.where({ 'status': status });
    if(provider) query.where({ 'provider': provider });

    query.select('_id date provider');

    query.exec((err,resp) => {
        if (err) return next(err);
        res.send(resp);
    });
});

// Get req details by ID
routes.get('/getPOrderDetail/:id', (req, res, next) => {

    const id = req.params.id;

    PurchaseOrder.findById(id, function (err, req) {
        if (err) return next(err)
        if (req) {
            res.send(req);
        } else {
            return new Error("PO not found");
        }

    });
});

// assign a date to 'order_sent'. Send an order to a provider.
routes.put('/sendOrder', celebrate(
    {
        body: Joi.object().keys({
            pOrderId: Joi.string().required(),
            provider: Joi.string().required()
        })
    }
), (req, res, next) => {
    //send order to provider via email or w/e

    PurchaseOrder.update(
        { _id: req.body.pOrderId },
        {
            $set:
                { order_sent: Date.now() }
        },
        function (err) {
            if (err) return next(err);
        });

});

// make a payment. grossTotal should be received from an invoice.
//TO DO: create a PAYMENTS module and migrate this code.
routes.put('/pay', celebrate(
    {
        body: Joi.object().keys({
            pOrderId: Joi.string().required(),
            provider: Joi.string().required(),
            invoice: Joi.string().required(),
            invoiceUrl: Joi.string(),
            total: Joi.number().required(),
            discount: Joi.number().required(),
            method: Joi.string().required(),
            method_reference: Joi.string(),
            items: Joi.array().items(Joi.object({
                sku: Joi.string().required(),
                qty: Joi.number().required(),
                title: Joi.string().required()
            })),
            items_entry: Joi.boolean().required(),
        })
    }
), (req, res, next) => {

    const purchase = new Purchase(
        {
            pOrderId: req.body.pOrderId,
            provider: req.body.provider,
            invoice: req.body.invoice,
            invoiceUrl: req.body.invoiceUrl,
            total: req.body.total,
            discount: req.body.discount,
            method: req.body.method,
            method_reference: req.body.method_reference,
            items: req.body.items,

        }
    );

    purchase.save((err, purchase) => {
        if (err) return next(err);

        if (purchase) {
            res.send(purchase);
        } else {
            return next(new Error("purchase creation failed"))
        }
    });

    ///After a purchase has been payed, we must control the entry of items, be it inmediate or scheduled.
    //For all items in the purchase.
    //**check efficiency of this process */
    const inbound_status = 'complete';
    if (!req.body.items_entry) {
        inbound_status = 'pending'
    }

    purchase.items.forEach(item => {
        var InboundItem = new InboundItem(
            {
                status: inbound_status,
                sku: item.sku,
                qty: item.qty,
                title: item.title,
                purchaseId: purchase._id
            }
        );

        //if items entry is true, item reception happens immediately after payment.
        if (req.body.items_entry) {
            InboundItem.set('reception',
                [{
                    arrival_date: Date.now(),
                    arrival_qty: req.body.arrival_qty,
                    arrival_details: req.body
                }]
            )

        }

        InboundItem.save((err, resp) => {
            if (err) return next(err);

            if (resp) {
                res.send(order);
            } else {
                return next(new Error("item entry registration failed"))
            }
        });

        //if item entry is immediate, update inventory as well.
        if (req.body.items_entry) {
            //update inventory immediately after
            Product.findByIdAndUpdate(
                item.sku,
                {
                    $inc: {
                        "inventory.qty": item.qty
                    }
                },
                'sku',
                (err, product) => {
                    if (err) return next(err);
                }
            );
        }


    });


});

// execute purchase. Transfer products to inventory.
routes.put('/completePurchase', celebrate(
    {
        body: Joi.object().keys({
            cartId: Joi.string().required()
        })
    }
), (req, res, next) => {

    //Set purchase to "Complete"
    Purchase.findOneAndUpdate(
        { "_id": req.body.purchaseId },
        {
            $set: { status: "complete" }
        },
        { safe: true, new: true },
        (err, purchase) => {
            if (err) return next(err);
            if (purchase.status == "complete") {
                res.send(purchase);
            } else {
                next(new Error("No Purchase: Cart doesn't exist or is no longer active."));
            }
        }
    );
});


module.exports = routes;