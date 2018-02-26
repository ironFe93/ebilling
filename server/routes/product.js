const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

var Product = require('../models/product');

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
        //console.log(products);
        res.send(products);
    });
});

// Get by SKU
routes.get('/find/:terms', (req, res) => {

    const terms = req.params.terms;
    console.log(terms);

    Product.find({$text : { $search: terms }},{'sku': true , 'title': true}, function (err, products) {
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

    Product.findById( id , function (err, product) {
        if (err) throw err;
        if (product){
            res.send(product);
        }else{
            throw new Error("Product not found");
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
            inventory : {
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

module.exports = routes;