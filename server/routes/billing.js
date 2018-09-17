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
    try {
        if (req.query.term) {

            projection = {
                '_id': true,
                'ID': true,
                'AccountingCustomerParty.PartyLegalEntity.RegistrationName': true
            }

            const term = req.query.term;
            const query = Bill.find({ $text: { $search: term } }, projection)
            const bills = await query.exec()
            res.send(bills);

        } else {
            res.send([]);
        }

    } catch (error) {
        next(error);
    }
});

// get a bill fully detailed
routes.get('/getDetail/:id', async (req, res, next) => {

    try {
        const bill = await Bill.findById(req.params.id).exec();
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
        const bill = await Bill.findById(req.body.id).exec();
        const ruc = bill.AccountingSupplierParty.PartyIdentification.ID;
        const billID = bill.ID;
        const fileName = ruc + '-01-' + billID;
        const base64String = await processBill.getBase64Zip(bill.toObject(), ruc);
        const result = await soapClient.sendBill(fileName + '.zip', base64String);
        if (result.name == "Error") {
            throw new Error(result.message);
        }
        const decodedResult = await processBill.decodeBase64(result.applicationResponse, fileName + '.xml');
        const updatedBill = await Bill.findOneAndUpdate({ID : billID}, 
            { $set: { Status: decodedResult }}, 
            {new: true, upsert: true}).exec();
        
        res.send(updatedBill);

    } catch (error) {
        console.log(error);
        next(error);
    }
});



module.exports = routes;
