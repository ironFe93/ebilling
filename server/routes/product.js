const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

const Product = require('../models/product');
const Counters = require('../models/counters');

routes.get('/', (req, res, next) => {
    res.status(200).json({ message: 'Products!' });
});

// Get all products
routes.get('/findall', (req, res, next) => {

    Product.find({}, function (err, products) {
        if (err) throw err;
        res.send(products);
    });
});

// Get all categories
routes.get('/categories', (req, res, next) => {

    query = Counters.find({ 'desc': { $exists: true } });
    query.select('desc');
    query.exec()
        .then(x => res.send(x))
        .catch(error => next(error));
});

// Get by SKU
routes.get('/find', (req, res, next) => {

    if (req.query.term) {
        const term = req.query.term;

        projection = { '_id': true, 'cod': true, 'descripcion': true, 'cod_medida': true };

        Product.find({ $text: { $search: term } }, projection , function (err, products) {
            if (err) return next(err);
            res.send(products);
        });

    } else {
        res.send([]);
    }
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
        res.send(product);
    });
});

// Create a Product
routes.post('/create', async (req, res, next) => {
    const newProd = new Product(req.body);

    try {
        newProd.cod = await getNextSequence(newProd.categoria);
    } catch (error) {
        return next(err);
    }

    newProd.save((err, prod) => {
        if (err) return next(err);
        res.send(prod);
    });
});

const getNextSequence = (categoria) => {

    query = Counters.findOneAndUpdate(
        {
            'desc': categoria
        },
        {
            $inc: { seq: 1 },
            new: true
        }
    );

    return query.exec()
        .then(x => {
            cod = x.prefix + x.seq
            return cod;
        })
        .catch(err => { return err });
}

module.exports = routes;
