const soap = require('soap');
const url = 'https://e-beta.sunat.gob.pe:443/ol-ti-itcpfegem-beta/billService?wsdl';

const wsdlOptions = {
    envelopeKey: 'soapenv'
};

const optionsSec = {
    passwordType: 'PasswordText',
    hasTimeStamp: false,
    hasTokenCreated: false
};

const wsSecurity = new soap.WSSecurity('20537793016MODDATOS', 'moddatos', optionsSec)

exports.getStatus = (ticket) => {
    return soap.createClientAsync(url, wsdlOptions).then((client, err) => {
        if (err) return next(err);

        const args = {
            _xml: '<ser:getStatus><ticket>' + ticket + '</ticket></ser:getStatus>'
        };

        client.wsdl.xmlnsInEnvelope = 'xmlns:ser="http://service.sunat.gob.pe"';
        client.setSecurity(wsSecurity);

        return client.getStatusAsync(args);
    }).then(result => {
        // result is a javascript array containing result, raw and soapheader
        // result is a javascript object
        // raw is the raw response
        // soapHeader is the response soap header as a javascript object
        return result[0];
    });
};

exports.sendBill = (fileName, contentFile) => {
    return soap.createClientAsync(url, wsdlOptions).then((client, err) => {
        if (err) return next(err);

        const args = {
            _xml: '<ser:sendBill>' +
                '<fileName>' + fileName + '</fileName>' +
                '<contentFile>' + contentFile + '</contentFile>' +
                '</ser:sendBill>'
        };

        client.wsdl.xmlnsInEnvelope = 'xmlns:ser="http://service.sunat.gob.pe"';
        client.setSecurity(wsSecurity);

        return client.sendBillAsync(args);
    }).then(result => {
        // result is a javascript array containing result, raw and soapheader
        // result is a javascript object
        // raw is the raw response
        // soapHeader is the response soap header as a javascript object
        console.log(result);
        return result[0];
    }).catch(err => {
        console.error(err);
        return err;
    });
};

// https://github.com/vpulim/node-soap
// https://gitter.im/vpulim/node-soap?at=5b04358d677d792bd1a8269f