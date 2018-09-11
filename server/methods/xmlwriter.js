const builder = require('xmlbuilder');
let atts;

exports.buildXML = (jsonBill) => {
    atts = attributes(jsonBill); //Initialize attributes

    //begin complex types

    const UBLExtension = builder.create('ext:UBLExtensions', { headless: true })
        .ele('ext:UBLExtension')
        .ele('ext:ExtensionContent')

    const AccountingSupplierParty = builder.create('cac:AccountingSupplierParty', { headless: true })
        .ele('cac:Party')
        .ele('cac:PartyIdentification')
        .ele('cbc:ID', atts.rucIDSupplierAtts, jsonBill.AccountingSupplierParty.PartyIdentification.ID)
        .up()
        .up()
        .ele('cac:PartyName')
        .ele('cbc:Name', jsonBill.AccountingSupplierParty.PartyName)
        .up()
        .up()
        .ele('cac:PartyLegalEntity')
        .ele('cbc:RegistrationName', jsonBill.AccountingSupplierParty.PartyLegalEntity.RegistrationName)

    const AccountingCustomerParty = builder.create('cac:AccountingCustomerParty', { headless: true })
        .ele('cac:Party')
        .ele('cac:PartyIdentification')
        .ele('cbc:ID', atts.rucIDCustomerAtts, jsonBill.AccountingCustomerParty.PartyIdentification.ID)
        .up()
        .up()
        .ele('cac:PartyLegalEntity')
        .ele('cbc:RegistrationName', jsonBill.AccountingCustomerParty.PartyLegalEntity.RegistrationName)

    const TaxTotal = builder.create('cac:TaxTotal', { headless: true })
        .ele('cbc:TaxAmount', atts.currencyID, jsonBill.TaxTotal.TaxAmount).up()

    jsonBill.TaxTotal.TaxSubtotal.forEach(subtotal => {
        TaxTotal.ele('cac:TaxSubtotal')
            .ele('cbc:TaxableAmount', atts.currencyID, subtotal.TaxableAmount).up()
            .ele('cbc:TaxAmount', atts.currencyID, subtotal.TaxAmount).up()
            .ele('cac:TaxCategory')
            .ele('cac:TaxScheme')
            .ele('cbc:ID', atts.taxCategoryIDAtt, subtotal.TaxCategory.TaxScheme.ID).up()
            .ele('cbc:Name', subtotal.TaxCategory.TaxScheme.Name).up()
            .ele('cbc:TaxTypeCode', subtotal.TaxCategory.TaxScheme.TaxTypeCode).up()
            .up()
            .up()
            .up()
    });

    const LegalMonetaryTotal = builder.create('cac:LegalMonetaryTotal', { headless: true })
        .ele('cbc:LineExtensionAmount', atts.currencyID, jsonBill.LegalMonetaryTotal.LineExtensionAmount).up()
        .ele('cbc:TaxInclusiveAmount', atts.currencyID, jsonBill.LegalMonetaryTotal.TaxInclusiveAmount).up()
        .ele('cbc:AllowanceTotalAmount', atts.currencyID, jsonBill.LegalMonetaryTotal.AllowanceTotalAmount).up()
        .ele('cbc:PayableAmount', atts.currencyID, jsonBill.LegalMonetaryTotal.PayableAmount).up()

    var InvoiceLine = builder.create('cac:InvoiceLine', { headless: true })

    jsonBill.InvoiceLine.forEach(line => {
        InvoiceLine.ele('cbc:ID', line.ID)
        InvoiceLine.ele('cbc:InvoicedQuantity', { unitCode: line.InvoicedQuantity.unitCode }, line.InvoicedQuantity.val);
        InvoiceLine.ele('cbc:LineExtensionAmount', atts.currencyID, line.LineExtensionAmount);
        InvoiceLine = addLinePricingReference(InvoiceLine, line);
        InvoiceLine = addLineAllowance(InvoiceLine, line);
        InvoiceLine = addLineTax(InvoiceLine, line);
        InvoiceLine = addLineItem(InvoiceLine, line);
        InvoiceLine = addLinePrice(InvoiceLine, line);
    });

    const AllowanceCharge = builder.create('cac:AllowanceCharge', { headless: true })
        .ele('cbc:ChargeIndicator', false).up()
        .ele('cbc:AllowanceChargeReasonCode', atts.AllowanceChargeAtt, '00').up()
        .ele('cbc:MultiplierFactorNumeric', 0).up()
        .ele('cbc:Amount', atts.currencyID, 0).up()
        .ele('cbc:BaseAmount', atts.currencyID, 25.42).up()


    //end complex types

    var Invoice = builder.create('Invoice', { encoding: 'UTF-8' })
        .att(atts.namespaces)

    Invoice.importDocument(UBLExtension);

    Invoice.ele('cbc:UBLVersionID', '2.1');
    Invoice.ele('cbc:CustomizationID', { schemeAgencyName: 'PE:SUNAT' }, '2.0');


    //Invoice.ele('cbc:ProfileID', profileIDAtts , "0101");
    Invoice.ele('cbc:ID', jsonBill.ID);
    Invoice.ele('cbc:IssueDate', jsonBill.IssueDate);
    Invoice.ele('cbc:IssueTime', jsonBill.IssueTime);
    Invoice.ele('cbc:DueDate', jsonBill.DueDate);


    Invoice.ele('cbc:InvoiceTypeCode', atts.InvoiceTypeCodeAtts, "01");
    Invoice.ele('cbc:Note', { languageLocaleID: '1000' }, jsonBill.Note);

    Invoice.ele('cbc:DocumentCurrencyCode', atts.DocCurrencyCodeAtts, jsonBill.DocumentCurrencyCode);

    Invoice.importDocument(AccountingSupplierParty);
    Invoice.importDocument(AccountingCustomerParty);
    Invoice.importDocument(AllowanceCharge);
    Invoice.importDocument(TaxTotal);
    Invoice.importDocument(LegalMonetaryTotal);
    Invoice.importDocument(InvoiceLine);

    string = Invoice.end({ pretty: true });
    return string;

}

addLineItem = (InvoiceLine, line) => {
    InvoiceLine.ele('cac:Item')
        .ele('cbc:Description', line.Item.Description).up()
        .ele('cac:SellersItemIdentification')
        .ele('cbc:ID', line.Item.SellersItemIdentification.ID).up()
        .up()

    return InvoiceLine;
}

addLinePrice = (InvoiceLine, line) => {
    InvoiceLine.ele('cac:Price').ele('cbc:PriceAmount', atts.currencyID, line.Price.PriceAmount);

    return InvoiceLine;
}

addLinePricingReference = (InvoiceLine, line) => {

    InvoiceLine.ele('cac:PricingReference')
        .ele('cac:AlternativeConditionPrice')
        .ele('cbc:PriceAmount', atts.currencyID, line.PricingReference.AlternativeConditionPrice.PriceAmount).up()
        .ele('cbc:PriceTypeCode', atts.priceTypeCodeAtt, line.PricingReference.AlternativeConditionPrice.PriceTypeCode);

    return InvoiceLine;
}

addLineTax = (InvoiceLine, line) => {
    InvoiceLine.ele('cac:TaxTotal')
        .ele('cbc:TaxAmount', atts.currencyID, line.TaxTotal.TaxAmount).up()
        .ele('cac:TaxSubtotal')
        .ele('cbc:TaxableAmount', atts.currencyID, line.TaxTotal.TaxSubtotal.TaxableAmount).up()
        .ele('cbc:TaxAmount', atts.currencyID, line.TaxTotal.TaxSubtotal.TaxAmount).up()
        .ele('cac:TaxCategory')
        .ele('cbc:Percent', line.TaxTotal.TaxSubtotal.TaxCategory.Percent).up()
        .ele('cbc:TaxExemptionReasonCode', atts.taxExemptionAtt, line.TaxTotal.TaxSubtotal.TaxCategory.TaxExemptionReasonCode).up()
        .ele('cac:TaxScheme')
        .ele('cbc:ID', atts.taxCategoryIDAtt, line.TaxTotal.TaxSubtotal.TaxCategory.TaxScheme.ID).up()
        .ele('cbc:Name', line.TaxTotal.TaxSubtotal.TaxCategory.TaxScheme.Name).up()
        .ele('cbc:TaxTypeCode', line.TaxTotal.TaxSubtotal.TaxCategory.TaxScheme.TaxTypeCode).up()
        .up()
        .up()
        .up()
        .up()

    return InvoiceLine;
}

addLineAllowance = (InvoiceLine, line) => {
    InvoiceLine.ele('cac:AllowanceCharge')
        .ele('cbc:ChargeIndicator', line.AllowanceCharge.ChargeIndicator).up()
        .ele('cbc:AllowanceChargeReasonCode', atts.AllowanceChargeAtt, line.AllowanceCharge.AllowanceChargeReasonCode).up()
        .ele('cbc:MultiplierFactorNumeric', line.AllowanceCharge.MultiplierFactorNumeric).up()
        .ele('cbc:Amount', atts.currencyID, line.AllowanceCharge.Amount).up()
        .ele('cbc:BaseAmount', atts.currencyID, line.AllowanceCharge.BaseAmount).up()
        .up();

    return InvoiceLine;
}

const attributes = (jsonBill) => {
    return atts = {
        rucIDSupplierAtts: {
            schemeID: jsonBill.AccountingSupplierParty.PartyIdentification.schemeID,
            schemeName: "SUNAT:Identificador de Documento de Identidad",
            schemeAgencyName: "PE:SUNAT",
            schemeURI: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
        },

        rucIDCustomerAtts: {
            schemeID: jsonBill.AccountingCustomerParty.PartyIdentification.schemeID,
            schemeName: "SUNAT:Identificador de Documento de Identidad",
            schemeAgencyName: "PE:SUNAT",
            schemeURI: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
        },

        taxCategoryIDAtt: {
            schemeID: "Codigo de tributos",
            schemeName: "PE:SUNAT",
            schemeAgencyName: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05"
        },

        priceTypeCodeAtt: {
            listName: "Tipo de Precio",
            listAgencyName: "PE:SUNAT",
            listURI: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
        },

        AllowanceChargeAtt: {
            listAgencyName: "PE:SUNAT",
            listName: "Cargo/descuento",
            listURI: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo53"
        },

        taxExemptionAtt: {
            listAgencyName: "PE:SUNAT",
            listName: "Afectacion del IGV",
            listURI: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
        },

        profileIDAtts: {
            schemeName: "SUNAT:Identificador de Tipo de Operación",
            schemeAgencyName: "PE:SUNAT",
            schemeURI: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo17"
        },

        currencyID: { currencyID: jsonBill.DocumentCurrencyCode },

        InvoiceTypeCodeAtts: {
            listAgencyName: "PE:SUNAT",
            listName: "Tipo de Documento",
            listURI: "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
            listID: "0101"
        },

        DocCurrencyCodeAtts: {
            listID: "ISO 4217 Alpha",
            listName: "Currency",
            listAgencyName: "United Nations Economic Commission for Europe"
        },

        namespaces: {
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
}