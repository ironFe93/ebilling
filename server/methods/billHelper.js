const Product = require('../models/product');
const Company = require('../models/company');
const TaxSubTotal = require('../models/tax-subtotal');
const Counters = require('../models/counters');
const Catalogs = require('../models/catalogs');

exports.buildBill = async (bill) => {
    try {
        const query = Company.findOne({ type: 'owner' });
        const company = await query.exec()
        // set the id number and series
        bill.ID = await getNextSequence('bill_id');

        //set DueDate
        bill.DueDate = calculate_due_date(new Date(bill.IssueDate), bill.cond_pago);

        // set AccountingSupplierParty
        bill = setAccountingSupplierParty(bill, company);

        let sumValues = {
            sumValorVentaBruto: 0,
            sumDescuentosPorItem: 0,
            sumValorVentaPorItem: 0,
            descuentoGlobal: 0,
            totalDescuentos: 0,
            totalOperacionesGravadas: 0,
            totalOperacionesExoneradas: 0,
            totalOperacionesInafectas: 0,
            sumIGV: 0,
            total: 0
        };

        bill.InvoiceLine = await calculate_invoice_lines(bill);
        sumValues = await calculate_totals(bill, sumValues);

        bill.sumValues = sumValues;

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
        bill.AccountingSupplierParty.PartyLegalEntity.RegistrationName = company.registration_name;
        bill.AccountingSupplierParty.PartyIdentification.ID = company.ruc;
        bill.AccountingSupplierParty.PartyIdentification.schemeID = '6';
    
        return bill;
    } catch (error) {
        throw error;
    }
}

calculate_invoice_lines = async (reqBody) => {
    try {
        let ID = 1;
        const invoiceLines = await reqBody.InvoiceLine.map(async line => {

            let unitValue; 
            let valor_venta_bruto;
            let descuento;
            let valor_venta;
            let IGV;

            if (line.TaxTotal.TaxSubtotal.TaxCategory.TaxExemptionReasonCode == 20){
                unitValue = line.PricingReference.AlternativeConditionPrice.PriceAmount;
                valor_venta_bruto = calculate_valor_v_bruto(unitValue, line.InvoicedQuantity.val);
                descuento = 0;
                valor_venta = calculate_valor_venta(valor_venta_bruto, descuento);
                IGV = 0;
            }else{
                unitValue = calculate_unit_value(line.PricingReference.AlternativeConditionPrice.PriceAmount);
                valor_venta_bruto = calculate_valor_v_bruto(unitValue, line.InvoicedQuantity.val);
                descuento = calculate_discount(valor_venta_bruto, line.AllowanceCharge.MultiplierFactorNumeric);
                valor_venta = calculate_valor_venta(valor_venta_bruto, descuento);
                IGV = calculate_taxes_IGV(valor_venta);
            }

            const query = Product.findOne({ cod: line.Item.SellersItemIdentification.ID });

            product = await query.exec()

            // set ID for line
            line.ID = ID;
            ID++;

            // set InvoicedQuantity unitcode
            line.InvoicedQuantity.unitCode = product.cod_medida;

            // set LineExtensionAmount
            line.LineExtensionAmount = valor_venta;

            // set PricingReference
            line.PricingReference.AlternativeConditionPrice.PriceTypeCode = '01'  ///this should come from frontend;

            // Set AllowanceCharge
            line.AllowanceCharge.Amount = descuento;
            line.AllowanceCharge.BaseAmount = valor_venta_bruto

            // set TaxTotal
            line.TaxTotal.TaxAmount = IGV;
            line.TaxTotal.TaxSubtotal.TaxableAmount = valor_venta;

            line.TaxTotal.TaxSubtotal.TaxAmount = IGV;

            // set Item
            line.Item.Description = product.descripcion;
            line.Item.SellersItemIdentification.ID = product.cod;

            // set Price
            line.Price.PriceAmount = unitValue;

            return line;
        });
        return Promise.all(invoiceLines).then(lines => { return lines });

    } catch (error) {
        throw error;
    }
}

calculate_unit_value = (precio_unit) => {
    return precio_unit / 1.18
}

calculate_valor_v_bruto = (valor_unitario, cantidad) => {
    return valor_unitario * cantidad;
}

calculate_discount = (valor_venta_bruto, factor) => {
    return valor_venta_bruto * (factor / 100)
}

calculate_valor_venta = (valor_venta_bruto, descuento) => {
    return valor_venta_bruto - descuento
}

calculate_taxes_IGV = (valor_venta) => {
    return valor_venta * 0.18;
}

calculate_totals = async (bill, sumValues) => {
    try {
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
                Line.TaxTotal.TaxSubtotal.TaxCategory.Percent = 18;
                totalItemsGravados += taxableAmount;
            } else if (taxSchemeID == 9997) {
                Line.TaxTotal.TaxSubtotal.TaxCategory.Percent = 0;
                totalItemsExonerados += taxableAmount;
            } else if (taxSchemeID == 9998) {
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
        sumValues.sumIGV = sumValues.totalOperacionesGravadas * 0.18;
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
        bill.TaxTotal.TaxAmount = bill.sumValues.sumIGV;
    currency = bill.DocumentCurrencyCode;
    taxSubtotalArray = [];
    if (bill.sumValues.totalOperacionesGravadas > 0) {
        taxSubtotal = new TaxSubTotal();

        taxSubtotal.TaxableAmount = bill.sumValues.totalOperacionesGravadas;
        taxSubtotal.TaxAmount = bill.sumValues.sumIGV;
        taxSubtotal.TaxCategory = {
            TaxSchemeID: 1000 
        } //MAKE BETTER
        taxSubtotalArray.push(taxSubtotal);
    };

    if (bill.sumValues.totalOperacionesExoneradas > 0) {
        taxSubtotal = new TaxSubTotal();

        taxSubtotal.TaxableAmount = bill.sumValues.totalOperacionesExoneradas;
        taxSubtotal.TaxAmount = 0;
        taxSubtotal.TaxCategory = {
            TaxSchemeID: 9997
        }

        taxSubtotalArray.push(taxSubtotal);
    };

    if (bill.sumValues.totalOperacionesInafectas > 0) {
        taxSubtotal = new TaxSubTotal();

        taxSubtotal.TaxableAmount = bill.sumValues.totalOperacionesInafectas;
        taxSubtotal.TaxAmount = 0;
        taxSubtotal.TaxCategory = {
            TaxSchemeID: 9996 ////??????????????????
        }

        taxSubtotalArray.push(taxSubtotal);
    };

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
        query = Counters.findOneAndUpdate(
            { prefix: name },
            {
                $inc: { seq: 1 },
                new: true
            }
        );

        counter = await query.exec();
        //control overflow of values
        if (counter.seq === 99999999) {
            Counters.findOneAndUpdate(
                { _id: name },
                { $inc: { ser: 1 }, seq: 0 },
            );
        }
        return counter.letter + counter.ser + '-' + counter.seq;

    } catch (error) {
        throw error;
    }
}

calculate_due_date = (IssueDate, days) => {
    try {
        var result = new Date(IssueDate);
        result.setDate(result.getDate() + days);
        return result;
    } catch (error) {
        throw error;
    }
}