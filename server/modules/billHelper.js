const Product = require('../models/product');
const Company = require('../models/company');
const TaxSubTotal = require('../models/tax-subtotal');
const Counters = require('../models/counters');
const Catalogs = require('../models/catalogs');

exports.buildBill = async (bill) => {
    try {
        if (bill.Status.ResponseCode === 0) throw new Error('Esta Factura ya fue enviada a SUNAT');
        const company = await Company.findOne({ ruc: process.env.RUC }).exec();

        // set the id number and series
        if (!bill.ID) bill.ID = await getNextSequence('bill_id');

        //set DueDate
        bill.DueDate = calculate_due_date(new Date(bill.IssueDate), bill.cond_pago);

        // set AccountingSupplierParty
        bill = setAccountingSupplierParty(bill, company);

        bill.InvoiceLine = await calculate_invoice_lines(bill);
        bill.sumValues = await calculate_totals(bill);

        // set AllowanceCharge
        bill = setAllowanceCharge(bill);

        // set TaxTotals
        bill = setTaxTotal(bill);

        // set legalMonetaryTotal
        bill = setLegalMonetaryTotal(bill);

        bill.Status = {
            Draft: true,
            Rejected: false,
            Description: 'Este documento aún no ha sido enviado a SUNAT'
        }

        return bill;

    } catch (error) {
        throw error;
    }
}

setAccountingSupplierParty = (bill, company) => {
    try {
        bill.AccountingSupplierParty.RegistrationName = company.registration_name;
        bill.AccountingSupplierParty.ID = process.env.RUC;
        bill.AccountingSupplierParty.schemeID = '6';
        return bill;
    } catch (error) {
        throw error;
    }
}

calculate_invoice_lines = async (reqBody) => {
    try {
        //BUILD FUNCTIONS
        getUnitVal = (unitPrice) => unitPrice / (1 + process.env.TAX_PERCENT / 100);
        getValorVBruto = (unitVal, qty) => unitVal * qty;
        getDiscount = ( valorVBruto, factor) => valorVBruto * (factor / 100)
        getValorV = (valorVBruto, descuento) => valorVBruto - descuento
        getIGV = (valor_venta) => valor_venta * (process.env.TAX_PERCENT / 100);

        setCalculatedValues = (line, unitPrice) => {
            line.Price.PriceAmount = getUnitVal(unitPrice);
            line.AllowanceCharge.BaseAmount = getValorVBruto(line.Price.PriceAmount, line.InvoicedQuantity.val);
            line.AllowanceCharge.Amount = getDiscount(line.AllowanceCharge.BaseAmount, line.AllowanceCharge.MultiplierFactorNumeric);
            line.LineExtensionAmount = getValorV(line.AllowanceCharge.BaseAmount, line.AllowanceCharge.Amount);
            line.TaxTotal.TaxSubtotal.TaxableAmount = line.LineExtensionAmount;
            line.TaxTotal.TaxAmount = getIGV(line.TaxTotal.TaxSubtotal.TaxableAmount);
            line.TaxTotal.TaxSubtotal.TaxAmount = line.TaxTotal.TaxAmount;
            
            return line;
        }
        //START
        let ID = 1;
        const invoiceLines = await reqBody.InvoiceLine.map(async line => {

            line = setCalculatedValues(line, line.PricingReference.AlternativeConditionPrice.PriceAmount);

            const product = await Product.findOne({ cod: line.Item.SellersItemIdentification.ID }).exec();

            // set ID for line
            line.ID = ID;
            ID++;

            // set InvoicedQuantity unitcode
            line.InvoicedQuantity.unitCode = product.cod_medida;

            // set PricingReference
            line.PricingReference.AlternativeConditionPrice.PriceTypeCode = '01'  ///this should come from frontend;

            // set Item
            line.Item.Description = product.descripcion;
            line.Item.SellersItemIdentification.ID = product.cod;

            return line;
        });
        return Promise.all(invoiceLines).then(lines => { return lines });

    } catch (error) {
        throw error;
    }
}

calculate_totals = async (bill) => {
    try {
        let sumValues = bill.sumValues;
        const factor = bill.AllowanceCharge.MultiplierFactorNumeric;

        let totalItemsGravados = 0;
        let totalItemsExonerados = 0;
        let totalItemsInafectos = 0;
        //totalItemsGratuitos = 0;

        catalog07 = await Catalogs.findById("5b992fee3369e7514123bc91").exec();

        bill.InvoiceLine.forEach(Line => {
            taxSchemeID = catalog07._doc.datos[Line.TaxTotal.TaxSubtotal.TaxCategory.TaxExemptionReasonCode].codigo_tributo;
            taxableAmount = Line.TaxTotal.TaxSubtotal.TaxableAmount;

            sumValues.sumValorVentaBruto += Line.AllowanceCharge.BaseAmount;
            sumValues.sumDescuentosPorItem += Line.AllowanceCharge.Amount;
            sumValues.sumValorVentaPorItem += Line.TaxTotal.TaxSubtotal.TaxableAmount;
            sumValues.sumIGV += Line.TaxTotal.TaxAmount;
            Line.TaxTotal.TaxSubtotal.TaxCategory.TaxSchemeID = taxSchemeID;
            if (taxSchemeID == 1000) {
                Line.TaxTotal.TaxSubtotal.TaxCategory.Percent = process.env.TAX_PERCENT;
                totalItemsGravados += taxableAmount;
            } else if (taxSchemeID == 9997) {
                Line.TaxTotal.TaxSubtotal.TaxCategory.Percent = 0;
                totalItemsExonerados += taxableAmount;
            } else if (taxSchemeID == 9998) {
                Line.TaxTotal.TaxSubtotal.TaxCategory.Percent = 0;
                totalItemsInafectos += Line.InvoicedQuantity.val * Line.PricingRefernce.AlternativeConditionPrice.PriceAmount;
                // la sunat codifica el 9998 como INAFECTO, sin embargo este valor
                // aparece en la factura como el VALOR DE VENTA OPERACIONES GRATUITAS
            }
        });

        sumValues.descuentoGlobal = sumValues.sumValorVentaPorItem * (factor / 100);
        sumValues.totalDescuentos = sumValues.descuentoGlobal + sumValues.sumDescuentosPorItem;
        sumValues.totalOperacionesGravadas = totalItemsGravados * (1 - (factor / 100));
        sumValues.totalOperacionesExoneradas = totalItemsExonerados * (1 - (factor / 100));
        sumValues.totalOperacionesInafectas = totalItemsInafectos;
        sumValues.sumIGV = sumValues.totalOperacionesGravadas * (process.env.TAX_PERCENT / 100);
        sumValues.total = sumValues.totalOperacionesGravadas + sumValues.totalOperacionesExoneradas + sumValues.sumIGV;
        return sumValues;

    } catch (error) {
        throw error;
    }
}

setAllowanceCharge = (bill) => {
    try {
        bill.AllowanceCharge.Amount = bill.sumValues.descuentoGlobal;
        bill.AllowanceCharge.BaseAmount = bill.sumValues.sumValorVentaPorItem;
        return bill;
    } catch (error) {
        throw error;
    }
}

setTaxTotal = (bill) => {
    try {
        getTaxSubTotal = (taxSubtotalArray, sumValue, taxAmount, SchemeID) => {
            if (bill.sumValues[sumValue] > 0) {
                taxSubtotal = new TaxSubTotal();
                taxSubtotal.TaxableAmount = bill.sumValues[sumValue];
                taxSubtotal.TaxAmount = taxAmount;
                taxSubtotal.TaxCategory = {
                    TaxSchemeID: SchemeID
                }
                taxSubtotalArray.push(taxSubtotal);
            }
            return taxSubtotalArray;
        }

        bill.TaxTotal.TaxAmount = bill.sumValues.sumIGV;
        taxSubtotalArray = [];
        taxSubtotalArray = getTaxSubTotal(taxSubtotalArray, 'totalOperacionesGravadas', bill.sumValues.sumIGV, 1000);
        taxSubtotalArray = getTaxSubTotal(taxSubtotalArray, 'totalOperacionesExoneradas', 0, 9997);
        taxSubtotalArray = getTaxSubTotal(taxSubtotalArray, 'totalOperacionesInafectas', 0, 9996);

        bill.TaxTotal.TaxSubtotal = taxSubtotalArray;

        return bill;
    } catch (error) {
        throw error;
    }
}


setLegalMonetaryTotal = (bill) => {
    try {
        bill.LegalMonetaryTotal = {
            LineExtensionAmount: bill.sumValues.sumValorVentaBruto,
            TaxInclusiveAmount: bill.sumValues.total,
            AllowanceTotalAmount: bill.sumValues.totalDescuentos,
            PayableAmount: bill.sumValues.total
        }
        return bill;
    } catch (error) {
        throw error;
    }
}

const getNextSequence = async (name) => {
    try {
        counter = await Counters.findOneAndUpdate({ prefix: name }, { $inc: { seq: 1 }, new: true }).exec();

        //control overflow of values
        if (counter.seq === 99999999) {
            Counters.findOneAndUpdate({ _id: name }, { $inc: { ser: 1 }, seq: 0 });
        }
        return counter.letter + counter.ser + '-' + counter.seq;
    } catch (error) {
        throw error;
    }
}

calculate_due_date = (IssueDate, days) => {
    try {
        var dueDate = new Date(IssueDate);
        dueDate.setDate(dueDate.getDate() + days);
        return dueDate;
    } catch (error) {
        throw error;
    }
}