const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

var Dashboard = require('../models/dashboard');

// Get all products
routes.get('/getAll', (req, res, next) => {

    const query = Dashboard.find({});

    query.exec((err, dashboard) => {
        if (err) throw err;
        res.send(dashboard);
    });
});

module.exports = routes;