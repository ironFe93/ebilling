const xmlwriter = require('./xmlwriter');

exports.buildXml = async (jsonObject) => {
    try {

        const dateIssued = new Date(jsonObject.IssueDate);
        const dateExpired = new Date(jsonObject.DueDate);
        jsonObject.IssueDate = getYearMonthDay(dateIssued);
        jsonObject.IssueTime = getHourMinuteSecond(dateIssued);
        jsonObject.DueDate = getYearMonthDay(dateExpired);

        const ruc = jsonObject.AccountingSupplierParty.Party.PartyIdentification.ID.val;
        const billID = jsonObject.ID;

        //order matters

        const xml = xmlwriter.buildXML(jsonObject);
        const signedXML = await signXML(xml);
        const base64Zip = await prepareZipAsBase64(signedXML, ruc, billID);
        return base64Zip;
    } catch (error) {
        return error;
    }

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

const prepareZipAsBase64 = (xml, ruc, billID) => {

    const JSZip = require("jszip");
    const zip = new JSZip();

    fileName = ruc + '-01-' + billID + '.xml';
    zipName = ruc + '-01-' + billID + '.zip';
    //zip.folder("dummy");
    zip.file(fileName, xml);

    return zip.generateAsync({ type: "base64" });

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

