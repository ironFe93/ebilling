let chai = require('chai');
let chaiHttp = require('chai-http');
var expect = chai.expect;
require('dotenv').config();

chai.use(chaiHttp);


describe('APIs', () => {

    let draftedBillID;

    describe('Billing', () => {

        describe('/POST new bill draft', () => {

            const body = { "InvoiceTypeCode": "01", "IssueDate": "2018-10-03T00:26:44.038Z", "AccountingCustomerParty": { "PartyIdentification": { "ID": 12345678910, "schemeID": "6" }, "PartyLegalEntity": { "RegistrationName": "testing" } }, "cond_pago": 15, "DocumentCurrencyCode": "PEN", "AllowanceCharge": { "AllowanceChargeReasonCode": "02", "ChargeIndicator": false, "MultiplierFactorNumeric": 5 }, "InvoiceLine": [{ "tipo": "Producto", "Item": { "Description": "CARTULINA FOSFORESCENTE VERDE", "SellersItemIdentification": { "ID": "CF-5" } }, "InvoicedQuantity": { "unitCode": "NIU", "val": 10 }, "PricingReference": { "AlternativeConditionPrice": { "PriceAmount": "10", "PriceTypeCode": "00" } }, "TaxTotal": { "TaxAmount": 0, "TaxSubtotal": { "TaxableAmount": 0, "TaxAmount": 0, "TaxCategory": { "TaxExemptionReasonCode": 10, "Percent": 18 } } }, "AllowanceCharge": { "MultiplierFactorNumeric": "10", "ChargeIndicator": false, "AllowanceChargeReasonCode": "00" } }, { "tipo": "Producto", "Item": { "Description": "CARTULINA PLASTIFICADA AZUL OSCURO", "SellersItemIdentification": { "ID": "CP-2" } }, "InvoicedQuantity": { "unitCode": "NIU", "val": 15 }, "PricingReference": { "AlternativeConditionPrice": { "PriceAmount": "20", "PriceTypeCode": "00" } }, "TaxTotal": { "TaxAmount": 0, "TaxSubtotal": { "TaxableAmount": 0, "TaxAmount": 0, "TaxCategory": { "TaxExemptionReasonCode": 10, "Percent": 18 } } }, "AllowanceCharge": { "MultiplierFactorNumeric": 0, "ChargeIndicator": false, "AllowanceChargeReasonCode": "00" } }], "Status": { "Draft": true, "Rejected": false } }

            it('it should POST one bill draft', (done) => {
                chai.request('localhost:' + process.env.DEV_PORT)
                    .post('/api/bill/saveDraft/')
                    .send(body)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        draftedBillID = res.body._id;
                        done();
                    });
            });
        });

        describe('/POST bill to SUNAT', () => {
            it('it should POST one bill to SUNAT', (done) => {

                chai.request('localhost:' + process.env.DEV_PORT)
                    .post('/api/bill/sendSunat/')
                    .send({ id: draftedBillID }).timeout(5000)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        done();
                    });
            });
        });

        describe('/GET detailed bill', () => {
            it('it should GET one bill', (done) => {
                chai.request('localhost:' + process.env.DEV_PORT)
                    .get('/api/bill/getDetail/' + draftedBillID)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        done();
                    });
            });
        });

        describe('/GET a list of bills', () => {
            it('it should GET a list of bills', (done) => {
                chai.request('localhost:' + process.env.DEV_PORT)
                    .get('/api/bill/find')
                    .query({term : 'F100'})
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res.body).to.be.a('array')
                        expect(res).to.have.status(200);
                        done();
                    });
            });
        });
    });
});