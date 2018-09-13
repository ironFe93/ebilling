const soap = require('soap');
const url = 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService?wsdl';


const wsdlOptions = {
    envelopeKey: 'soapenv'
};

const optionsSec = {
    passwordType: 'PasswordText',
    hasTimeStamp: false,
    hasTokenCreated: false
};

const wsSecurity = new soap.WSSecurity('20537793016MODDATOS', 'moddatos', optionsSec)

exports.getStatus = async (ticket) => {
    try {
        const args = {
            _xml: '<ser:getStatus><ticket>' + ticket + '</ticket></ser:getStatus>'
        };

        client = await soap.createClientAsync(url, wsdlOptions);
        client.wsdl.xmlnsInEnvelope = 'xmlns:ser="http://service.sunat.gob.pe"';
        client.setSecurity(wsSecurity);

        result = await client.getStatusAsync(args);
        return result[0];
    } catch (error) {
        return error;
    }
};


exports.sendBill = async (fileName, contentFile) => {

    try {
        const args = {
            _xml: '<ser:sendBill>' +
                '<fileName>' + fileName + '</fileName>' +
                '<contentFile>' + contentFile + '</contentFile>' +
                '</ser:sendBill>'
        };

        client = await soap.createClientAsync(url, wsdlOptions);
        client.wsdl.xmlnsInEnvelope = 'xmlns:ser="http://service.sunat.gob.pe"';
        client.setSecurity(wsSecurity);

        result = await client.sendBillAsync(args);
        return result[0];
        // result is a javascript array containing result, raw, error and soapheader
        // result is a javascript object
        // raw is the raw response
        // soapHeader is the response soap header as a javascript object
    } catch (error) {
        return error;
    }
}

// https://github.com/vpulim/node-soap
// https://gitter.im/vpulim/node-soap?at=5b04358d677d792bd1a8269f