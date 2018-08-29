const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

const Bill = require('../models/bill');

const Company = require('../models/company');
const Counters = require('../models/counters');

const billHelper = require('../methods/billHelper');



routes.get('/', (req, res, next) => {
    res.status(200).json({ message: 'bills!' });
});

// Get by search term
routes.get('/find', async (req, res, next) => {

    projection = {
        '_id': true,
        'ID': true,
        'AccountingCustomerParty.Party.PartyTaxScheme.RegistrationName': true
    }

    if (req.query.term) {
        const term = req.query.term;

        const bills = await Bill.find(
            { $text: { $search: term } },
            projection
        ).exec()
            .then(bills => bills)
            .catch(err => next(err));

        res.send(bills);

    } else {
        res.send([]);
    }
});

// get a bill fully detailed
routes.get('/getDetail/:_id', (req, res, next) => {

    Bill.findById(req.params._id, (err, bill) => {
        if (err) return next(err);
        bill = billHelper.simplify(bill);
        res.send(bill);
    });
});

// Joi validation with Celebrate libary
routes.post('/saveDraft', async (req, res, next) => {

    // next(new Error('just testing lol'));
    bill = new Bill({});

    const query = Company.findOne({ type: 'owner' });

    const company = await query.exec()
        .then(
            resp => {
                return resp;
            }
        ).catch(err => next(err));



    bill.UBLExtensions.ds_signature = '67381dhkkjnkbcjb398hd';

    // set the id number and series
    try {
        bill.ID = await getNextSequence('bill_id');
    } catch (error) {
        next(error);
    }

    //set Dates
    const fullIssueDate = new Date(req.body.fecha_emision);
    bill.IssueDate = fullIssueDate;
    bill.IssueTime = fullIssueDate;

    bill.cond_pago = req.body.cond_pago;

    const dueDate = new Date();
    dueDate.setDate(fullIssueDate.getDate() + req.body.cond_pago);
    bill.DueDate = dueDate;

    // set Note
    //bill.Note.val = getLetterTotalValue();
    bill.Note.val = "PLACEHOLDER"

    //set DocumentCurrencyCode
    bill.DocumentCurrencyCode.val = req.body.moneda;

    // set DespatchDocReference
    if (req.guia_remision) {
        bill = billHelper.setDespatch(bill, req.despatchID);
    }

    // set AdditionalDocReference
    if (req.otro_doc) {
        bill = billHelper.setAdditionalDoc(bill, req.additionalDocID);
    }

    // set AccountingSupplierParty
    bill = billHelper.setAccountingSupplierParty(bill, company);

    // set AccountingCustomerParty
    bill = billHelper.setAccountingCustomerParty(bill, req.body.cliente)


    // set DeliveryTerms
    if (req.address) {
        bill.DeliveryTerms.DeliveryLocation.Address = company.address
    } else {
        //bill.DeliveryTerms.DeliveryLocation.Address = req.body.address
    }

    let sumValues = {
        sumValorVentaBruto: 0,
        sumDescuentosPorItem: 0,
        sumValorVentaPorItem: 0,
        descuentoGlobal: 0,
        totalDescuentos: 0,
        totalOperacionesGravadas: 0,
        totalOperacionesExoneradas: 0,
        totalOperacionesInafectas: 0,
        sumIGV: 0,
        total: 0
    };

    bill.InvoiceInline = await billHelper.calculate_invoice_inlines(req.body);
    sumValues = billHelper.calculate_totals(bill, sumValues, req.body.descuento_global);

    bill.sumValues = sumValues;

    // set AllowanceCharge
    if (req.body.descuento) {
        bill.AllowanceCharge = {
            ChargeIndicator: false,
            AllowanceChargeReasonCode: 0,
            MultiplierFactorNumeric: req.body.descuento.factor,
            Amount: {
                att: {
                    currencyID: req.body.moneda,
                },
                val: sumValues.descuentoGlobal
            },
            BaseAmount: {
                att: {
                    currencyID: req.body.moneda,
                },
                val: sumValues.sumValorVentaPorItem
            }
        }
    }

    // set TaxTotals
    bill = billHelper.setTaxSubTotals(bill, sumValues);

    // set legalMonetaryTotal
    bill = billHelper.setLegalMonetaryTotal(bill, sumValues);

    let savedBill;
    try {
        savedBill = await bill.save();
    } catch (error) {
        next(error);
    }

    simpleBill = billHelper.simplify(savedBill);
    res.send(simpleBill);
});

routes.get('/download', async (req, res, next) => {
    const _id = req.query._id;

    bill = await Bill.findById(_id).exec()
        .then(bill => bill)
        .catch(err => next(err));
});

routes.post('/sendBill', async (req, res, next) => {
    const xmlBuilder = require('../methods/xmlBuilder');
    const soapClient = require('../methods/soap-client');
    const _id = req.body._id;

    try {
        const bill = await Bill.findById(_id).exec();
        const ruc = bill.AccountingSupplierParty.Party.PartyTaxScheme.CompanyID.val;
        const billID = bill.ID;
        const fileName = ruc + '-01-' + billID + '.zip';
        const base64String = await xmlBuilder.buildXml(bill.toObject());
        result = await soapClient.sendBill(fileName, base64String);
        res.send(result);

    } catch (error) {
        next(error)
    }
});

const getNextSequence = (name) => {

    query = Counters.findOneAndUpdate(
        {
            prefix: name
        },
        {
            $inc: { seq: 1 },
            new: true
        }
    );

    return query.exec()
        .then(
            x => {
                // control overflow of seq
                if (x.seq === 99999999) {
                    Counters.findOneAndUpdate(
                        { _id: name },
                        { $inc: { ser: 1 }, seq: 0 },
                    );
                }
                ID = x.letter + x.ser + '-' + x.seq;
                return ID;
            }
        ).catch(err => { return err });
}

calculate_expiration_date = (bill) => {
    bill.fecha_bill.fecha_emision + bill.cond_pago;

}

module.exports = routes;
