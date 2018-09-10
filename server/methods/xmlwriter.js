const builder = require('xmlbuilder');
exports.buildXML = (jsonBill) => {

    const namespaces = {
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

    //begin complex types

    const UBLExtension = builder.create('ext:UBLExtensions', { headless: true })
        .ele('ext:UBLExtension')
        .ele('ext:ExtensionContent')

    const rucIDAtts = {
        schemeID:"6",
        schemeName:"SUNAT:Identificador de Documento de Identidad",
        schemeAgencyName:"PE:SUNAT",
        schemeURI:"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
    }

    const AccountingSupplierParty = builder.create('cac:AccountingSupplierParty', { headless: true })
    .ele('cac:Party')
    .ele('cac:PartyIdentification')
    .ele('cbc:ID', rucIDAtts, jsonBill.AccountingSupplierParty.Party.PartyIdentification.ID.val)
    .up()
    .up()
    .ele('cac:PartyName')
    .ele('cbc:Name', jsonBill.AccountingSupplierParty.Party.PartyName.Name)
    .up()
    .up()
    .ele('cac:PartyLegalEntity')
    .ele('cbc:RegistrationName', jsonBill.AccountingSupplierParty.Party.PartyLegalEntity.RegistrationName)

    const AccountingCustomerParty = builder.create('cac:AccountingCustomerParty', { headless: true })
    .ele('cac:Party')
    .ele('cac:PartyIdentification')
    .ele('cbc:ID', rucIDAtts, jsonBill.AccountingCustomerParty.Party.PartyIdentification.ID.val)
    .up()
    .up()
    .ele('cac:PartyLegalEntity')
    .ele('cbc:RegistrationName', jsonBill.AccountingCustomerParty.Party.PartyLegalEntity.RegistrationName)

    const currencyID = {currencyID: jsonBill.DocumentCurrencyCode.val}

    taxCategoryIDAtt = {
        schemeID:"Codigo de tributos",
        schemeName:"PE:SUNAT",
        schemeAgencyName:"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05"
    }

    const TaxTotal = builder.create('cac:TaxTotal', { headless: true })
    .ele('cbc:TaxAmount', currencyID, jsonBill.TaxTotal.TaxAmount.val).up()

    jsonBill.TaxTotal.TaxSubtotal.forEach(subtotal => {
        TaxTotal.ele('cac:TaxSubtotal')
        .ele('cbcTaxableAmount', currencyID, subtotal.TaxableAmount.val).up()
        .ele('cbc:TaxAmount', currencyID, subtotal.TaxAmount.val).up()
        .ele('cac:TaxCategory')
        .ele('cac:TaxScheme')
        .ele('cbc:ID', taxCategoryIDAtt, subtotal.TaxCategory.TaxScheme.ID.val).up()
        .ele('cbc:Name', subtotal.TaxCategory.TaxScheme.Name).up()
        .ele('cbc:TaxTypeCode', subtotal.TaxCategory.TaxScheme.TaxTypeCode).up()
        .up()
        .up()
        .up()
    });

    const LegalMonetaryTotal = builder.create('cac:LegalMonetaryTotal', { headless: true })
    .ele('cbc:LineExtensionAmount', currencyID, jsonBill.LegalMonetaryTotal.LineExtensionAmount.val).up()
    .ele('cbc:TaxInclusiveAmount', currencyID, jsonBill.LegalMonetaryTotal.TaxInclusiveAmount.val).up()
    .ele('cbc:AllowanceTotalAmount', currencyID, jsonBill.LegalMonetaryTotal.AllowanceTotalAmount.val).up()
    .ele('cbc:PayableAmount', currencyID, jsonBill.LegalMonetaryTotal.PayableAmount.val).up()

    priceTypeCodeAtt = {
        listName:"Tipo de Precio",
        listAgencyName:"PE:SUNAT",
        listURI:"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
    }

    AllowanceChargeAtt = {
        listAgencyName:"PE:SUNAT",
        listName:"Cargo/descuento",
        listURI:"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo53"
    }

    taxExemptionAtt = {
        listAgencyName:"PE:SUNAT",
        listName:"Afectacion del IGV",
        listURI:"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
    }

    var InvoiceLine = builder.create('cac:InvoiceLine', { headless: true })

    jsonBill.InvoiceLine.forEach(line => {
        InvoiceLine.ele('cbc:ID', line.ID).up()
        .ele('cbc:InvoicedQuantity', {unitCode: 'KG'}, line.InvoicedQuantity.val).up()
        .ele('cac:Item')
        .ele('cac:SellersItemIdentification')
        .ele('cbc:ID', line.Item.SellersItemIdentification.ID).up()
        .up()
        .ele('cbc:description', line.Item.description).up()
        .up()
        .ele('cac:Price')
        .ele('cbc:PriceAmount', currencyID, line.Price.PriceAmount.val).up()
        .up()
        .ele('cac:PricingReference')
        .ele('cac:AlternativeConditionPrice')
        .ele('cbc:PriceAmount', currencyID, line.PricingReference.AlternativeConditionPrice.PriceAmount.val).up()
        .ele('cbc:PriceTypeCode', priceTypeCodeAtt, line.PricingReference.AlternativeConditionPrice.PriceTypeCode.val).up()
        .up()
        .up()
        .ele('cac:TaxTotal')
        .ele('cbc:TaxAmount', currencyID,  line.TaxTotal.TaxAmount.val).up()
        .ele('cac:TaxSubtotal')
        .ele('cbcTaxableAmount', currencyID, line.TaxTotal.TaxSubtotal.TaxableAmount.val).up()
        .ele('cbc:TaxAmount', currencyID, line.TaxTotal.TaxSubtotal.TaxAmount.val).up()
        .ele('cac:TaxCategory')
        .ele('cbc:Percent', line.TaxTotal.TaxSubtotal.TaxCategory.Percent).up()
        .ele('cbc:TaxExemptionReasonCode', taxExemptionAtt, line.TaxTotal.TaxSubtotal.TaxCategory.TaxExemptionReasonCode.val).up()
        .ele('cac:TaxScheme')
        .ele('cbc:ID', taxCategoryIDAtt, line.TaxTotal.TaxSubtotal.TaxCategory.TaxScheme.ID.val).up()
        .ele('cbc:Name', line.TaxTotal.TaxSubtotal.TaxCategory.TaxScheme.Name).up()
        .ele('cbc:TaxTypeCode', line.TaxTotal.TaxSubtotal.TaxCategory.TaxScheme.TaxTypeCode).up()
        .up()
        .up()
        .up()
        .up()
        .ele('cbc:LineExtensionAmount', currencyID, line.LineExtensionAmount.val).up()
        .ele('cac:Allowancecharge')
        .ele('cbc:ChargeIndicator', line.AllowanceCharge.ChargeIndicator).up()
        .ele('cbc:AllowanceChargeReasonCode', AllowanceChargeAtt ,line.AllowanceChargeReasonCode).up()
        .ele('cbc:MultiplierFactorNumeric', line.AllowanceCharge.MultiplierFactorNumeric).up()
        .ele('cbc:Amount', currencyID, line.AllowanceCharge.Amount.val).up()
        .ele('cbc:BaseAmount', currencyID, line.AllowanceCharge.BaseAmount.val).up()
        
    });

    const AllowanceCharge = builder.create('cac:AllowanceCharge', { headless: true })
    .ele('cbc:ChargeIndicator', false).up()
    .ele('cbc:AllowanceChargeReasonCode', AllowanceChargeAtt , 0).up()
    .ele('cbc:MultiplierFactorNumeric', 0).up()
    .ele('cbc:Amount', currencyID, 0).up()
    .ele('cbc:BaseAmount', currencyID, 25.42).up()


    //end complex types

    var Invoice = builder.create('Invoice', { encoding: 'utf-8', standalone: false })
        .att(namespaces)

    Invoice.importDocument(UBLExtension);

    Invoice.ele('cbc:UBLVersionID', 2.1);
    Invoice.ele('cbc:CustomizationID', '2.0');

    profileIDAtts = {
        schemeName:"SUNAT:Identificador de Tipo de Operación", 
        schemeAgencyName:"PE:SUNAT", 
        schemeURI:"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo17"
    }
    Invoice.ele('cbc:ProfileID', profileIDAtts , "0101");
    Invoice.ele('cbc:ID', jsonBill.ID);
    Invoice.ele('cbc:IssueDate', jsonBill.IssueDate);
    Invoice.ele('cbc:IssueTime', jsonBill.IssueTime);
    Invoice.ele('cbc:DueDate', jsonBill.DueDate);

    InvoiceTypeCodeAtts = {
        listAgencyName:"PE:SUNAT", 
        listName:"Tipo de Documento", 
        listURI:"urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01", 
        listID:"0101"
    }
    Invoice.ele('cbc:InvoiceTypeCode', InvoiceTypeCodeAtts, "01" );
    Invoice.ele('cbc:Note',{languageLocaleID: '1000'}, jsonBill.Note.val );

    DocCurrencyCodeAtts = {
        listID: "ISO 4217 Alpha",
        listName: "Currency",
        listAgencyName: "United Nations Economic Commission for Europe"
    }

    Invoice.ele('cbc:DocumentCurrencyCode', DocCurrencyCodeAtts , jsonBill.DocumentCurrencyCode.val);

    Invoice.importDocument(AccountingSupplierParty);
    Invoice.importDocument(AccountingCustomerParty);
    Invoice.importDocument(InvoiceLine);
    Invoice.importDocument(TaxTotal);
    Invoice.importDocument(AllowanceCharge);
    Invoice.importDocument(LegalMonetaryTotal);
    
    string = Invoice.end();
    return string;

}