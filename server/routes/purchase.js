const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

const Product = require('../models/product');
const Item = require('../models/item');
const PurchaseInvoice = require('../models/purchase-invoice');
const dboard = require('../methods/dashboard');

// insert an invoice into system, then increase inventory
routes.post('/registerInvoice', (req, res, next) => {
    const invoice = new PurchaseInvoice(req.body);
    invoice.save((err, resp) => {
        if (err) return next(err);
        res.send(resp);

        resp.items.forEach(item => {
            query = Product.where({ 'sku': item.sku })
            query.update({ $inc: { 'inventory.qty': item.qty } });
            query.exec();
        });
        
    });




    //missing: increase inventory
});

// find invoices by queryparams
routes.get('/findInvoice', (req, res, next) => {
    const date1 = new Date(req.query.date1);
    const date2 = new Date(req.query.date2);
    const sku = req.query.sku;
    const string = req.query.string;
    const status = req.query.status;
    const provider = req.query.provider;
    const ruc = req.query.ruc;

    const query = PurchaseInvoice.find();

    if (checkIfDateValid(date1)) query.where('date').gte(date1);
    if (checkIfDateValid(date2)) query.where('date').lte(date2);
    if (sku) query.where({ 'items.sku': sku });
    if (string) query.where({ 'items.title': string });
    if (status) query.where({ 'status': status });
    if (provider) query.where({ 'provider': provider });
    if (ruc) query.where({ 'ruc': ruc });

    query.select('_id date provider');

    query.exec((err, resp) => {
        if (err) return next(err);
        res.send(resp);
    });
});

// Get Invoice details by ID
routes.get('/getInvoiceDetail/:id', (req, res, next) => {

    const id = req.params.id;

    PurchaseInvoice.findById(id, function (err, resp) {
        if (err) return next(err);
        res.send(resp);
    });
});

// checks if a date object is valid
const checkIfDateValid = (date) => {

    if (Object.prototype.toString.call(date) === '[object Date]') { // it is a date
        if (isNaN(date.getTime())) return false; else return true; // d.valueOf() could also work
    } else return false;
};

module.exports = routes;
