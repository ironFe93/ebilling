const xmlwriter = require('./xmlwriter');
const JSZip = require("jszip");

exports.getBase64Zip = async (jsonObject) => {
    try {
        //construct xml, sign it, then zip it and return it as base64
        const xml = await xmlwriter.buildXML(jsonObject);
        const signedXML = await signXML(xml);
        const base64Zip = await prepareZipAsBase64(signedXML, process.env.RUC, jsonObject.ID);
        return base64Zip;
    } catch (error) {
        throw error;
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
        throw error;
    }
}

const signXML = async (xml) => {
    try {
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

        // commence
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
        sig.signingKey = process.env.PRIVATE_KEY;
        sig.keyInfoProvider = new keyInfoProvider(process.env.PUBLIC_CERT);
        sig.computeSignature(xml, signatureOpts);
        return sig.getSignedXml();
    } catch (error) {
        throw error;
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

        const initIndexID = xml.search('</ext:UBLExtensions><cbc:ID>');
        const lastIndexID = xml.search('</cbc:ID><cbc:IssueDate>');
        const responseID = xml.substring(initIndexID + 28, lastIndexID);

        const response = {
            Draft: false,
            Rejected: false,
            ResponseCode: responseRespCode,
            Description: responseDesc,
            ID: responseID
        }

        if(response.ResponseCode != 0) {
            response.Rejected = true
        }

        return response;

    } catch (error) {
        throw error;
    }

}