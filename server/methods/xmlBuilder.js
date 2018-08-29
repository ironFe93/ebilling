

exports.buildXml = async (jsonObject) => {
    try {
        delete jsonObject['cond_pago'];
        delete jsonObject['sumValues'];
        delete jsonObject['_id'];
        delete jsonObject['__v'];
        delete jsonObject['CustomizationID'];

        jsonObject.InvoiceInline.forEach(inline => {
            delete inline["_id"];
        });

        jsonObject.TaxTotal.TaxSubTotal.forEach(subtotal => {
            delete subtotal["_id"];
        });

        const issueDate = new Date(jsonObject.IssueDate);
        jsonObject.IssueDate = getYearMonthDay(issueDate);
        jsonObject.IssueTime = getHourMinuteSecond(issueDate);
        jsonObject.DueDate = getYearMonthDay(jsonObject.DueDate);

        const ruc = jsonObject.AccountingSupplierParty.Party.PartyTaxScheme.CompanyID.val;
        const billID = jsonObject.ID;

        //order matters
        const objectUBL = addUBL(jsonObject);
        objectUBL['att'] = appendXMLNamespace(objectUBL);

        const xmlObject = await jsonToXML(objectUBL);
        const base64Zip = await prepareZipAsBase64(xmlObject, ruc, billID);
        return base64Zip;
    } catch (error) {
        return error;
    }

}

const addUBL = (jsonObject) => {
    const propertyNames = Object.getOwnPropertyNames(jsonObject);
    propertyNames.forEach(property => {
        const object = jsonObject[property];
        if (!(property === 'ext:UBLExtensions')) {
            if ((!isObject(object) && !Array.isArray(object)) || object.hasOwnProperty('val')) {
                cbcjsonObject = setCBC(jsonObject, property);
                //console.log(property);

            } else if (Array.isArray(object)) {
                object.forEach(element => {
                    addUBL(element);
                });
                cacjsonObject = setCAC(jsonObject, property);
            } else {
                addUBL(object);
                cacjsonObject = setCAC(jsonObject, property);
            }
        }
    });
    return jsonObject;
}

// Returns if a value is an object
const isObject = (value) => {
    return value && typeof value === 'object' && value.constructor === Object;
}

const setCBC = (object, property) => {

    object['cbc:' + property] = object[property]
    delete object[property];

    return object;
}

const setCAC = (object, property) => {

    object['cac:' + property] = object[property]
    delete object[property];

    return object;
}

const getYearMonthDay = (date) => {

    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDate();

    return year + "-" + month + "-" + day
}

const getHourMinuteSecond = (date) => {

    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();

    return hour + ":" + minute + ":" + second
}

const jsonToXML = async (jsonObject) => {
    const js2xmlparser = require("js2xmlparser");
    const options = {
        attributeString: "att",
        valueString: "val",
        declaration: {
            include: true,
            version: "1.0",
            encoding: "ISO-8859-1",
            standalone: "no"
        }
    };

    try {
        const xml = js2xmlparser.parse("Invoice", jsonObject, options);
        const signedXml = await signXML(xml);
        return signedXml;
    } catch (error) {
        console.error(error);
    }
}

const prepareZipAsBase64 = (xml, ruc, billID) => {

    const JSZip = require("jszip");
    const zip = new JSZip();

    fileName = ruc + '-01-' + billID + '.xml';
    zipName = ruc + '-01-' + billID + '.zip';
    //zip.folder("dummy");
    zip.file(fileName, xml);

    return zip.generateAsync({ type: "base64" });

}

const appendXMLNamespace = () => {
    return {
        "xmlns": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
        "xmlns:cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
        "xmlns:cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
        "xmlns:ds": "http://www.w3.org/2000/09/xmldsig#",
        "xmlns:ext": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
    }
}

const signXML = async (xml) => {
    const util = require('util');
    const fs = require("fs");
    const keyInfoProvider = require('./keyInfoProvider');

    //xml-crypto
    var SignedXml = require('xml-crypto').SignedXml;
    const signatureOpts = {
        prefix: "ds",
        location: {
            reference: "//*[local-name(.)='ExtensionContent']",
            action: "append"
        }
    };

    // pem

    const pem = require("pem");
    pem.config({
        pathOpenSSL: 'C:/OpenSSL-Win64/bin/openssl'
    });
    const readPkcs12 = util.promisify(pem.readPkcs12);

    // commence

    const pfx = fs.readFileSync("./server/files/cert.pfx");
    const pemCert = await readPkcs12(pfx, { p12Password: "abc123" });
    console.log(pemCert);
    const sig = new SignedXml();

    sig.addReference("//*[local-name(.)='ExtensionContent']");
    sig.signingKey = pemCert.key;
    sig.keyInfoProvider = new keyInfoProvider(pemCert.cert);
    sig.computeSignature(xml, signatureOpts);
    return sig.getSignedXml();
}