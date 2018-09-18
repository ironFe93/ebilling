const express = require('express');
const routes = express.Router();
const Dashboard = require('../models/dashboard');

// Get all products
routes.get('/getAll', async (req, res, next) => {
    try {
        const query = Dashboard.find({});
        dashboard = await query.exec()
        res.send(dashboard);
    } catch (error) {
        next(error);
    }
});

module.exports = routes;