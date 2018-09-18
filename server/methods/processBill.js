const xmlwriter = require('./xmlwriter');
const JSZip = require("jszip");
const Certificate = require('../models/certificate');

exports.getBase64Zip = async (jsonObject, ruc) => {
    try {
        const dateIssued = new Date(jsonObject.IssueDate);
        const dateExpired = new Date(jsonObject.DueDate);
        jsonObject.IssueDate = getYearMonthDay(dateIssued);
        jsonObject.IssueTime = getHourMinuteSecond(dateIssued);
        jsonObject.DueDate = getYearMonthDay(dateExpired);

        const billID = jsonObject.ID;

        //order matters

        const xml = await xmlwriter.buildXML(jsonObject);
        const signedXML = await signXML(xml);
        const base64Zip = await prepareZipAsBase64(signedXML, ruc, billID);
        return base64Zip;
    } catch (error) {
        return error;
    }

}


const formatDateTimeFields = (field) => {
    try {
        if (field < 10) { field = '0' + field };
        return field;
    } catch (error) {
        return error;
    }

}

const getYearMonthDay = (date) => {
    try {
        year = date.getFullYear();
        month = formatDateTimeFields(date.getMonth());
        day = formatDateTimeFields(date.getDate());

        return year + "-" + month + "-" + day;
    } catch (error) {
        return error;
    }
}

const getHourMinuteSecond = (date) => {
    try {
        hour = formatDateTimeFields(date.getHours());
        minute = formatDateTimeFields(date.getMinutes());
        second = formatDateTimeFields(date.getSeconds());

        return hour + ":" + minute + ":" + second;
    } catch (error) {
        return error;
    }
}

const prepareZipAsBase64 = (xml, ruc, billID) => {
    try {
        const zip = new JSZip();

        fileName = ruc + '-01-' + billID + '.xml';
        zipName = ruc + '-01-' + billID + '.zip';
        //zip.folder("dummy");
        zip.file(fileName, xml);

        return zip.generateAsync({ type: "base64" });
    } catch (error) {
        return error;
    }
}

const signXML = async (xml) => {
    try {
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

        const encodedB64Cert = await Certificate.findById("5ba0425652b10d27784370ad").exec();
        const pfx = Buffer.from(encodedB64Cert.certPFX, 'base64');
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
    } catch (error) {
        return error;
    }

}

exports.decodeBase64 = async (base64, fileName) => {

    try {
        const zip = new JSZip();
        const zipResponse = await zip.loadAsync(base64, { base64: true });

        const xml = await zipResponse.file('R-' + fileName).async("string");
        const initIndexDesc = xml.search('<cbc:Description>');
        const lastIndexDesc = xml.search('</cbc:Description>');
        const responseDesc = xml.substring(initIndexDesc + 17, lastIndexDesc);

        const initIndexRespCode = xml.search('<cbc:ResponseCode>');
        const lastIndexRespCode = xml.search('</cbc:ResponseCode>');
        const responseRespCode = xml.substring(initIndexRespCode + 18, lastIndexRespCode);

        const initIndexID = xml.search('ID><cbc:ID>');
        const lastIndexID = xml.search('</cbc:ID>');
        const responseID = xml.substring(initIndexID + 11, lastIndexID);

        const response = {
            ResponseCode: responseRespCode,
            Description: responseDesc,
            ID: responseID
        }
        return response;

    } catch (error) {
        return error;
    }

}