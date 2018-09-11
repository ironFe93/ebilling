const Product = require('../models/product');
const Company = require('../models/company');
const TaxSubTotal = require('../models/tax-subtotal');
const SimpleBill = require('../models/bill-simple');

exports.buildBill = async (bill) => {
    try {
        const query = Company.findOne({ type: 'owner' });
        const company = await query.exec()
        // set the id number and series
        bill.ID = await getNextSequence('bill_id');

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
        sumValues = calculate_totals(bill, sumValues);

        bill.sumValues = sumValues;

        // set AllowanceCharge
        bill = setAllowanceCharge(bill);

        // set TaxTotals
        bill = setTaxTotal(bill, sumValues);

        // set legalMonetaryTotal
        bill = setLegalMonetaryTotal(bill, sumValues);

        // set Note
        bill = getLetterTotalValue(bill);

        return bill;

    } catch (error) {
        return (error);
    }
}

setAccountingSupplierParty = (bill, company) => {

    bill.AccountingSupplierParty.PartyLegalEntity.RegistrationName = company.registration_name;
    bill.AccountingSupplierParty.PartyIdentification.ID = company.ruc;
    bill.AccountingSupplierParty.PartyIdentification.schemeID = '6';

    return bill;
}

calculate_invoice_lines = async (reqBody) => {

    let ID = 1;

    const invoiceLines = await reqBody.InvoiceLine.map(async line => {

        try {

            const unitValue = calculate_unit_value(line.AlternativeConditionPrice.PriceAmount);
            const valor_venta_bruto = calculate_valor_v_bruto(unitValue, line.InvoicedQuantity.val);
            const descuento = calculate_discount(valor_venta_bruto, line.AllowanceCharge.MultiplierFactorNumeric);
            const valor_venta = calculate_valor_venta(valor_venta_bruto, descuento);
            const IGV = calculate_taxes_IGV(valor_venta);

            const query = Product.findOne({ cod: line.cod });

            product = await query.exec()

            // set ID for line
            line.ID = ID;
            ID++;

            // set InvoicedQuantity
            line.InvoicedQuantity.unitCode = product.cod_medida;

            // set LineExtensionAmount
            line.LineExtensionAmount = valor_venta;

            // set PricingReference
            line.PricingReference.AlternativeConditionPrice.PriceAmount = line.precio_unitario.monto;
            line.PricingReference.AlternativeConditionPrice.PriceTypeCode = 1  ///this should come from frontend;

            // Set AllowanceCharge
            line.AllowanceCharge.Amount = descuento;
            line.AllowanceCharge.BaseAmount = valor_venta_bruto

            // set TaxTotal
            line.TaxTotal.TaxAmount = IGV;
            line.TaxTotal.TaxSubTotal.TaxableAmount = valor_venta;

            line.TaxTotal.TaxSubTotal.TaxAmount = IGV;

            // set Item
            line.Item.Description = product.descripcion;
            line.Item.SellersItemIdentification.ID = product.cod;

            // set Price
            line.Price.PriceAmount = unitValue;

            return line;

        } catch (err) {
            return err;
        }
    });
    return Promise.all(invoiceLines).then(lines => { return lines });
}

calculate_unit_value = (precio_unit) => {
    return precio_unit / 1.18
}

calculate_valor_v_bruto = (valor_unitario, cantidad) => {
    return valor_unitario * cantidad;
}

calculate_discount = (valor_venta_bruto, factor) => {
    return valor_venta_bruto * factor
}

calculate_valor_venta = (valor_venta_bruto, descuento) => {
    return valor_venta_bruto - descuento
}

calculate_taxes_IGV = (valor_venta) => {
    return valor_venta * 0.18;
}

calculate_totals = (bill, sumValues) => {

    const factor = bill.AllowanceCharge.MultiplierFactorNumeric; 

    let totalItemsGravados = 0;
    let totalItemsExonerados = 0;
    let totalItemsInafectos = 0;
    //totalItemsGratuitos = 0;

    bill.InvoiceLine.forEach(Line => {
        taxSchemeID = Line.TaxTotal.TaxSubTotal.TaxCategory.TaxScheme.ID;
        taxableAmount = Line.TaxTotal.TaxSubTotal.TaxableAmount;

        sumValues.sumValorVentaBruto += Line.AllowanceCharge.BaseAmount;
        sumValues.sumDescuentosPorItem += Line.AllowanceCharge.Amount;
        sumValues.sumValorVentaPorItem += Line.TaxTotal.TaxSubTotal.TaxableAmount;
        sumValues.sumIGV += Line.TaxTotal.TaxAmount;
        if (taxSchemeID === 1000) {
            totalItemsGravados += taxableAmount;
        } else if (taxSchemeID === 9997) {
            totalItemsExonerados += taxableAmount;
        } else if (taxSchemeID === 9998) {
            totalItemsInafectos += Line.InvoicedQuantity.val * Line.PricingRefernce.AlternativeConditionPrice.PriceAmount;
            // la sunat codifica el 9998 como INAFECTO, sin embargo este valor
            // aparece en la factura como el VALOR DE VENTA OPERACIONES GRATUITAS
        }
    });

    sumValues.descuentoGlobal = sumValues.sumValorVentaPorItem * factor;
    sumValues.totalDescuentos = sumValues.descuentoGlobal + sumValues.sumDescuentosPorItem;
    sumValues.totalOperacionesGravadas = totalItemsGravados * (1 - factor);
    sumValues.totalOperacionesExoneradas = totalItemsExonerados * (1 - factor);
    sumValues.totalOperacionesInafectas = totalItemsInafectos;
    sumValues.sumIGV = sumValues.totalOperacionesGravadas * 0.18;
    sumValues.total = sumValues.totalOperacionesGravadas + sumValues.totalOperacionesExoneradas + sumValues.sumIGV;

    return sumValues;

}

setAllowanceCharge = (bill) => {
    bill.AllowanceCharge.Amount = sumValues.descuentoGlobal;
    bill.AllowanceCharge.BaseAmount = sumValues.sumValorVentaPorItem;

    return bill
}

setTaxTotal = (bill, sumValues) => {

    bill.TaxTotal.TaxAmount.val = sumValues.sumIGV;
    currency = bill.DocumentCurrencyCode.val;
    taxSubTotalArray = [];
    if (sumValues.totalOperacionesGravadas > 0) {
        taxSubTotal = new TaxSubTotal();

        taxSubTotal.TaxableAmount = setTaxableAmount(currency, sumValues.totalOperacionesGravadas);
        taxSubTotal.TaxAmount = setTaxAmount(currency, sumValues.sumIGV);
        taxSubTotal.TaxCategory = setTaxCategory(taxSubTotal.TaxCategory, "S", 1000, "IGV", "VAT");

        taxSubTotalArray.push(taxSubTotal);
    };

    if (sumValues.totalOperacionesExoneradas > 0) {
        taxSubTotal = new TaxSubTotal();

        taxSubTotal.TaxableAmount = setTaxableAmount(currency, sumValues.totalOperacionesExoneradas);
        taxSubTotal.TaxAmount = setTaxAmount(currency, 0);
        taxSubTotal.TaxCategory = setTaxCategory(taxSubtotal.TaxCategory, "E", 9997, "EXONERADO", "VAT");

        taxSubTotalArray.push(taxSubTotal);
    };

    if (sumValues.totalOperacionesInafectas > 0) {
        taxSubTotal = new TaxSubTotal();

        taxSubTotal.TaxableAmount = setTaxableAmount(currency, sumValues.totalOperacionesInafectas);
        taxSubTotal.TaxAmount = setTaxAmount(currency, 0);
        taxSubTotal.TaxCategory = setTaxCategory(taxSubtotal.TaxCategory, "O", 9998, "INAFECTO", "FRE");

        taxSubTotalArray.push(taxSubTotal);
    };

    bill.TaxTotal.TaxSubTotal = taxSubTotalArray;

    return bill;
}


setTaxCategory = (taxCategory, id, taxSchemeID, name, typecode) => {

    taxCategory.ID.val = id;
    taxCategory.TaxScheme.ID.val = taxSchemeID;
    taxCategory.TaxScheme.Name = name;
    taxCategory.TaxScheme.TaxTypeCode = typecode;

    return taxCategory;
}

setLegalMonetaryTotal = (bill, sumValues) => {

    bill.LegalMonetaryTotal = {
        LineExtensionAmount: sumValues.sumValorVentaBruto,
        TaxInclusiveAmount: sumValues.total,
        AllowanceTotalAmount: sumValues.totalDescuentos,
        PayableAmount: sumValues.total   
    }

    return bill;
}

const getNextSequence = async (name) => {

    query = Counters.findOneAndUpdate(
        { prefix: name },
        {
            $inc: { seq: 1 },
            new: true
        }
    );

    try {
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
        return error;
    }
}

calculate_expiration_date = (bill) => {
    bill.fecha_bill.fecha_emision + bill.cond_pago;
}

getLetterTotalValue = (bill) => {
    bill.Note.val = 'placeholder'
}