const xmlwriter = require('./xmlwriter');

exports.buildXml = async (jsonObject) => {
    try {
        delete jsonObject['cond_pago'];
        delete jsonObject['sumValues'];
        delete jsonObject['_id'];
        delete jsonObject['__v'];

        delete jsonObject['DeliveryTerms'];
        delete jsonObject['AccountingSupplierParty']['Party']['PartyLegalEntity']['RegistrationAddress'];
        //delete jsonObject['Note'];

        jsonObject.InvoiceLine.forEach(inline => {
            delete inline["_id"];
        });

        jsonObject.TaxTotal.TaxSubtotal.forEach(subtotal => {
            delete subtotal["_id"];
        });

        const dateIssued = new Date(jsonObject.IssueDate);
        const dateExpired = new Date(jsonObject.DueDate);
        jsonObject.IssueDate = getYearMonthDay(dateIssued);
        jsonObject.IssueTime = getHourMinuteSecond(dateIssued);
        jsonObject.DueDate = getYearMonthDay(dateExpired);

        const ruc = jsonObject.AccountingSupplierParty.Party.PartyIdentification.ID.val;
        const billID = jsonObject.ID;

        //order matters

        ////TESTING
        xmlwriter.buildXML(jsonObject);
        ////
        const objectUBL = addUBL(jsonObject);
        objectUBL['att'] = appendXMLNamespace(objectUBL);
        const mapObj = jsonToMap(objectUBL);
        const xmlObject = await jsonToXML(mapObj);
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

const formatDateTimeFields = (field) => {
    if (field < 10) { field = '0' + field };
    return field;
}

const getYearMonthDay = (date) => {

    year = date.getFullYear();
    month = formatDateTimeFields(date.getMonth());
    day = formatDateTimeFields(date.getDate());

    return year + "-" + month + "-" + day
}

const getHourMinuteSecond = (date) => {

    hour = formatDateTimeFields(date.getHours());
    minute = formatDateTimeFields(date.getMinutes());
    second = formatDateTimeFields(date.getSeconds());

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
            encoding: "UTF-8",
            standalone: "no"
        },
        format: {
            doubleQuotes: true,
            pretty: false
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
        "xmlns:ccts": "urn:un:unece:uncefact:documentation:2",
        "xmlns:ds": "http://www.w3.org/2000/09/xmldsig#",
        "xmlns:ext": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
        "xmlns:qdt": "urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2",
        "xmlns:udt": "urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
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
    const sig = new SignedXml();

    sig.addReference(// reference to the root node
        "/*",
        [
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/2001/10/xml-exc-c14n#'
        ],
        'http://www.w3.org/2000/09/xmldsig#sha1',
        '',
        '',
        '',
        // let the URI attribute with an empty value,
        // this is the signal that the signature is affecting the whole xml document
        true
    );
    sig.signingKey = pemCert.key;
    sig.keyInfoProvider = new keyInfoProvider(pemCert.cert);
    sig.computeSignature(xml, signatureOpts);
    return sig.getSignedXml();
}

jsonToMap = (json) => {
    // initialize map with ORDERED KEYS
    var myBill = new Map([
        ['att', ''],
        ['ext:UBLExtensions', ''],
        ['cbc:UBLVersionID', ''],
        ['cbc:CustomizationID', ''],
        ['cbc:ProfileID', ''],
        ['cbc:ID', ''],
        ['cbc:IssueDate', ''],
        ['cbc:IssueTime', ''],
        ['cbc:DueDate', ''],
        ['cbc:InvoiceTypeCode', ''],
        ['cbc:Note', ''],
        ['cbc:DocumentCurrencyCode', ''],
        ['cbc:DespatchDocumentReference', ''],
        ['cbc:AdditionalDocumentReference', ''],
        ['cac:AccountingSupplierParty', ''],
        ['cac:AccountingCustomerParty', ''],
        ['cac:DeliveryTerms', ''],
        ['cac:AllowanceCharge', ''],
        ['cac:TaxTotal', ''],
        ['cac:LegalMonetaryTotal', ''],
        ['cac:InvoiceLine', '']
    ]);

    myInline = new Map([
        ['cbc:ID', ''],
        ['cbc:InvoicedQuantity', ''],
        ['cbc:LineExtensionAmount', ''],
        ['cac:PricingReference', ''],
        ['cac:AllowanceCharge', ''],
        ['cac:TaxTotal', ''],
        ['cac:Item', ''],
        ['cac:Price', '']
    ]);

    myInlineTaxCategory = new Map([
        ['cbc:Percent', ''],
        ['cbc:ID', ''],
        ['cbc:TaxExemptionReasonCode', ''],
        ['cac:TaxScheme', ''],
    ]);

    myAllowanceCharge = new Map([
        ['cbc:ChargeIndicator', ''],
        ['cbc:AllowanceChargeReasonCode', ''],
        ['cbc:MultiplierFactorNumeric', ''],
        ['cbc:Amount', ''],
        ['cbc:BaseAmount', ''],
    ]);

    myRegistrationAddress = new Map([
        ['cac:AddressLine', ''],
        ['cbc:CitySubdivisionName', ''],
        ['cbc:CityName', ''],
        ['cbc:ID', ''],
        ['cbc:CountrySubentity', ''],
        ['cbc:District', ''],
        ['cbc:IdentificationCode', ''],
    ]);

    /* regAddress = json['cac:AccountingSupplierParty']['cac:Party']['cac:PartyLegalEntity']['cac:RegistrationAddress'];
    json['cac:AccountingSupplierParty']['cac:Party']['cac:PartyLegalEntity']['cac:RegistrationAddress'] = toMapInSequence(regAddress, myRegistrationAddress)
 */
    myBill.forEach((val, key) => {
        if (typeof json[key] == 'undefined') {
            myBill.delete(key);
        } else if (key === 'cac:InvoiceLine') {

            const line = json['cac:InvoiceLine'].map(inline => {

                myInline.forEach((val2, key2) => {

                    if (key2 == 'cac:AllowanceCharge') {
                        myAllowanceCharge.forEach((val3, key3) => {
                            myAllowanceCharge.set(key3, inline[key2][key3]);
                        });
                        myInline.set('cac:AllowanceCharge', myAllowanceCharge);
                    } else {
                        myInline.set(key2, inline[key2]);
                    }
                });
                return myInline;
            });

            myBill.set('cac:InvoiceLine', line);
        } else {
            myBill.set(key, json[key]);
        }
    });

    return myBill
}

toMapInSequence = (json, map) => {
    map.forEach((val, key) => {
        if (typeof json[key] == 'undefined') {
            map.delete(key);
        } else {
            map.set(key, json[key]);
        }
    });

    return map;
}