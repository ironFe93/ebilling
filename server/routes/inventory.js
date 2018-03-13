const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

const Product = require('../models/product');
const InboundItem = require('../models/inbound-item');

//schedule arrivals

//stock items either partially or completely. 
routes.put('/stock', celebrate(
    {
        body: Joi.object().keys({
            inboundItemId: String,
            arrival_qty: Joi.string().required(),
            arrival_details: Joi.string().required(),
            status: Joi.string().required()
        })
    }
), (req, res, next) => {

    let sku;

    //change status of inbound item, update qty expected, push reception (arrival) details
    InboundItem.findOneAndUpdate(
        {
            '_id': req.body.inboundItemId,
            'status': { $ne: "complete" },
            'qty_expected': { $gte: req.body.arrival_qty }
        },
        {
            $set: {
                status: req.body.status,
            },
            $inc: {
                qty_expected: -req.body.arrival_qty
            },
            $push: {
                "reception":
                    {
                        arrival_date: Date.now(),
                        arrival_qty: req.body.arrival_qty,
                        arrival_details: req.body
                    }
            }
        },
        { safe: true, new: true },
        (err, item) => {
            if (err) return next(err);

            if (item) {
                res.send(item);
                sku = item.sku
            } else {
                next(new Error("Couldn't update stock."));
            }
        }
    );

    //update inventory
    Product.findByIdAndUpdate(
        sku,
        {
            $inc: {
                "inventory.qty": req.body.arrival_qty
            }
        },
        'sku',
        (err, product) => {
            if (err) return next(err);
        }
    );



});