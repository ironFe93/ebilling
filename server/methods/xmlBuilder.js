

exports.buildXml = async (jsonObject) => {
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
    const cert = await appendDigitalCert(objectUBL);
    objectUBL['ext:UBLExtensions'] = cert['ext:UBLExtensions'];

    const xmlObject = jsonToXML(objectUBL);
    const base64Zip = await prepareZipAsBase64(xmlObject, ruc, billID);
    return base64Zip;
}

const addUBL = (jsonObject) => {
    const propertyNames = Object.getOwnPropertyNames(jsonObject);
    propertyNames.forEach(property => {
        const object = jsonObject[property];

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

const jsonToXML = (jsonObject) => {
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
        return xml;
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

const appendDigitalCert = () => {
    const Cert = require('../models/cert');
    return Cert.findById("5b7f31de09c95eabc4fb5308").exec();
}