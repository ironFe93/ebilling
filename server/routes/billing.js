const express = require('express');
const routes = express.Router();
const processBill = require('../modules/processBill');
const soapClient = require('../modules/soap-client');

const Bill = require('../models/bill');

const Company = require('../models/company');

const billHelper = require('../modules/billHelper');

// Get by search term
routes.get('/find', async (req, res, next) => {
    try {
        if (req.query.term) {

            projection = {
                '_id': true,
                'ID': true,
                'AccountingCustomerParty.RegistrationName': true,
                'AccountingCustomerParty.ID': true
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
        const completeBill = await billHelper.buildBill(bill);
        const savedBill = await Bill.findOneAndUpdate(
            {'_id': bill.id}, completeBill , { upsert: true, new: true }).exec();
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
        if (!bill) throw new Error('Bill not found');
        const billID = bill.ID;
        const fileName = process.env.RUC + '-01-' + billID;
        const base64String = await processBill.getBase64Zip(bill.toObject());
        const result = await soapClient.sendBill(fileName + '.zip', base64String);
        const decodedResult = await processBill.decodeBase64(result.applicationResponse, fileName + '.xml');
        const updatedBill = await Bill.findOneAndUpdate(
            {ID : billID}, 
            { 'Status': decodedResult },
            {new: true, upsert: true})
            .exec();
        
        res.send(updatedBill);

    } catch (error) {
        console.log(error);
        next(error);
    }
});



module.exports = routes;
