const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

const Product = require('../models/product');
const ProductRequisition = require('../models/product-req');
const dboard = require('../methods/dashboard');

routes.get('/', (req, res, next) => {
    res.status(200).json({ message: 'Products!' });
});

// Get all products
routes.get('/findall', (req, res, next) => {
    // Get posts from the mock api
    // This should ideally be replaced with a service that connects to MongoDB

    Product.find({}, function (err, products) {
        if (err) throw err;

        // object of all the users
        // console.log(products);
        res.send(products);
    });
});

// Get by SKU
routes.get('/find/:terms', (req, res) => {

    const terms = req.params.terms;
    console.log(terms);

    Product.find({ $text: { $search: terms } }, { 'sku': true, 'title': true }, function (err, products) {
        if (err) throw err;
        res.send(products);
    });
});

// Get All details by ID
routes.get('/getDetails/:id', celebrate(
    {
        params: Joi.object().keys({
            id: Joi.string().required()
        })
    }
), (req, res, next) => {

    const id = req.params.id;

    Product.findById(id, function (err, product) {
        if (err) throw err;
        if (product) {
            res.send(product);
        } else {
            throw new Error('Product not found');
        }

    });
});

// Create a Product
routes.post('/create', celebrate(
    {
        body: Joi.object().keys({
            sku: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string(),
            inventory: {
                qty: Joi.string().required()
            },
            listPrice: Joi.string().required()
        })
    }
), (req, res, next) => {
    const newProd = new Product(req.body);

    newProd.save((err, prod) => {
        if (err) return next(err);
        res.send(prod);
    });
});

// Create a ProductRequisition
routes.post('/registerReq', celebrate(
    {
        body: Joi.object().keys({
            items: Joi.array().items({
                sku: Joi.string().required(),
                qty: Joi.number().required(),
                title: Joi.string().required(),
                status: Joi.string()
            })
        })
    }
), (req, res, next) => {
    const newProdReq = new ProductRequisition(req.body);
    console.log(req.body);
    newProdReq.save(async (err, resp) => {
        if (err) return next(err);
        res.send(resp);
        if (resp.status === 'open') {
            const reg = await dboard.findOrCreate('requisitions', resp._id, 'open', next);
            if (reg) dboard.emit(req);
        }
    });
});

// Get Req by searchTerms
routes.get('/findReq', (req, res, next) => {
    'findReq?y1=yyyy&m1=mm&d1=dd&y2=yyyy&m2=mm&d2=dd&sku=12345678=string=test&status=active';
    const date1 = new Date(req.query.date1);
    const date2 = new Date(req.query.date2);
    const sku = req.query.sku;
    const string = req.query.string;
    const status = req.query.status;

    const query = ProductRequisition.find();

    if (checkIfDateValid(date1)) query.where('date').gte(date1);
    if (checkIfDateValid(date2)) query.where('date').lte(date2);
    if (sku) query.where({ 'items.sku': sku });
    if (string) query.where({ 'items.title': string });
    if (status) query.where({ 'status': status });

    query.select('_id date');

    query.exec((err, resp) => {
        if (err) return next(err);
        res.send(resp);
    });
});

// Get req details by ID
routes.get('/getReqDetail/:id', (req, res, next) => {

    const id = req.params.id;

    ProductRequisition.findById(id, function (err, resp) {
        if (err) return next(err);
        res.send(resp);

    });
});

// checks if a date object is valid
const checkIfDateValid = (date) => {

    if ( Object.prototype.toString.call(date) === '[object Date]' ) { // it is a date
        if (isNaN( date.getTime())) return false ; else return true; // d.valueOf() could also work
      } else return false;
};

// callback function mongoose response hanlder
/* const responseHandler = (err, resp) => {
    if (err) return next(err);
    res.send(resp);
}; */

module.exports = routes;
