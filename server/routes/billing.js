const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');
const processBill = require('../methods/processBill');
const soapClient = require('../methods/soap-client');

const Bill = require('../models/bill');

const Company = require('../models/company');

const billHelper = require('../methods/billHelper');

routes.get('/', (req, res, next) => {
    res.status(200).json({ message: 'bills!' });
});

routes.post('/test', async (req, res, next) => {

    try {
        //triggers failure
        // const company = await Company.find({ $text: { $search: 'universal' } }).exec();
        //does not fail
        const company = await Company.findOne({ type: 'owner' }).exec();
        res.send(company);

    } catch (error) {
        next(error)
    }
});

// Get by search term
routes.get('/find', async (req, res, next) => {

    projection = {
        '_id': true,
        'ID': true,
        'AccountingCustomerParty.PartyLegalEntity.RegistrationName': true
    }

    if (req.query.term) {
        const term = req.query.term;

        try {
            const query = Bill.find({ $text: { $search: term } }, projection)
            const bills = await query.exec()
            res.send(bills);
        } catch (error) {
            next(error);
        }

    } else {
        res.send([]);
    }
});

// get a bill fully detailed
routes.get('/getDetail/:_id', async (req, res, next) => {

    try {
        const bill = await Bill.findById(req.params._id).exec();
        res.send(bill);
    } catch (error) {
        next(error);
    }

});

routes.post('/saveDraft', async (req, res, next) => {
    try {
        const bill = new Bill(req.body);
        const completeBill = await billHelper.buildBill(bill)
        const savedBill = await completeBill.save();
        res.send(savedBill);
    } catch (error) {
        next(error);
    }
});

routes.get('/download', async (req, res, next) => {
    const _id = req.query._id;
    try {
        bill = await Bill.findById(_id).exec();
    } catch (error) {
        next(error);
    }

});

routes.post('/sendSunat', async (req, res, next) => {
    try {
        const _id = req.body._id;
        const bill = await Bill.findById(_id).exec();
        const ruc = bill.AccountingSupplierParty.PartyIdentification.ID;
        const billID = bill.ID;
        const fileName = ruc + '-01-' + billID + '.zip';
        const base64String = await processBill.getBase64Zip(bill.toObject(), ruc);
        result = await soapClient.sendBill(fileName, base64String);
        res.send(result);

    } catch (error) {
        next(error)
    }
});



module.exports = routes;
