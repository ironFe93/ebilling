const express = require('express');
const routes = express.Router();

routes.post('/internalError', async (req, res, next) => {
    try {
        //triggers an internal error
        throw new Error('testing errors');

    } catch (error) {
        next(error);
    }
});

module.exports = routes;