const express = require('express');
const routes = express.Router();

const Product = require('../models/product');
const Counters = require('../models/counters');


// Get all products
routes.get('/findall', async (req, res, next) => {
    try {
        products = await Product.find({}).exec()
        res.send(products);
    } catch (error) {
        next(error);
    }
});

// Get all categories
routes.get('/categories', async (req, res, next) => {
    try {
        query = Counters.find({ 'desc': { $exists: true } });
        query.select('desc');
        categories = await query.exec();
        res.send(categories);
    } catch (error) {
        next(error);
    }
});

// Get by SKU
routes.get('/find', async (req, res, next) => {
    try {
        if (req.query.term) {
            const term = req.query.term;
            projection = { '_id': true, 'cod': true, 'descripcion': true, 'cod_medida': true };

            products = await Product.find({ $text: { $search: term } }, projection).exec()
            res.send(products);
        } else {
            res.send([]);
        }
    } catch (error) {
        next(error);
    }
});

// Get All details by ID
routes.get('/getDetails/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        product = await Product.findById(id).exec();
        res.send(product);
    } catch (error) {
        next(error);
    }
});

// Create a Product
routes.post('/create', async (req, res, next) => {
    try {
        const newProd = new Product(req.body);
        newProd.cod = await getNextSequence(newProd.categoria);
        const savedProd = await newProd.save();
        res.send(savedProd);
    } catch (error) {
        next(error);
    }
});

const getNextSequence = async (categoria) => {
    try {
        query = Counters.findOneAndUpdate(
            { 'desc': categoria },
            {
                $inc: { seq: 1 },
                new: true
            }
        );

        const x = await query.exec()
        const cod = x.prefix + x.seq
        return cod;

    } catch (error) {
        throw (error);
    }
}

module.exports = routes;
