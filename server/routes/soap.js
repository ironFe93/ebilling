const express = require('express');
const routes = express.Router();

const soapClient = require('../methods/soap-client');

// insert an invoice into system, then increase inventory
routes.post('/getStatus', async (req, res, next) => {
    
    try{
        result = await soapClient.getStatus(req.body.ticket);
    }catch(err){
        next(err)
    }

    console.log(result);
    res.send(result);

});

module.exports = routes;