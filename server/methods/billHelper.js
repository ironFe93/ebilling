const Product = require('../models/product');
const InvoiceInline = require('../models/bill-invoice-inline');
const TaxSubTotal = require('../models/tax-subtotal');
const SimpleBill = require('../models/bill-simple');

exports.setDespatch = (bill, reference) => {

    bill.DespatchDocumentReference.ID = reference;
    bill.DespatchDocumentReference.DocumentTypeCode = 9;

    return bill;
}

exports.setAdditionalDoc = (bill, reference) => {

    bill.AdditionalDocumentReference.ID = reference;
    bill.AdditionalDocumentReference.DocumentTypeCode = 9;

    return bill;
}

exports.setAccountingSupplierParty = (bill, company) => {

    bill.AccountingSupplierParty.Party.PartyName.Name = company.registration_name;
    bill.AccountingSupplierParty.Party.PartyTaxScheme.RegistrationName = company.registration_name;
    bill.AccountingSupplierParty.Party.PartyTaxScheme.CompanyID.val = company.ruc

    return bill;
}

exports.setAccountingCustomerParty = (bill, cliente) => {

    bill.AccountingCustomerParty.Party.PartyTaxScheme.RegistrationName = cliente.registration_name;
    bill.AccountingCustomerParty.Party.PartyTaxScheme.CompanyID.val = cliente.ruc

    return bill;
}

exports.calculate_invoice_inlines = async (reqBody) => {

    let ID = 1;

    const invoiceInlines = await reqBody.items.map(async item => {

        invoiceInline = new InvoiceInline({});

        const unitValue = calculate_unit_value(item.precio_unitario.monto);
        const valor_venta_bruto = calculate_valor_v_bruto(unitValue, item.cantidad);
        const descuento = calculate_discount(valor_venta_bruto, item.descuento.factor);
        const valor_venta = calculate_valor_venta(valor_venta_bruto, descuento);
        const IGV = calculate_taxes_IGV(valor_venta);

        const query = Product.findOne({ cod: item.cod });
        try {
            product = await query.exec()
                .then(
                    product => { return product }
                ).catch(
                    err => { return err }
                );
        } catch (err) {
            return err;
        }

        // set ID for inline
        invoiceInline.ID = ID;
        ID++;

        // set InvoicedQuantity
        invoiceInline.InvoicedQuantity.att.unitCode = product.cod_medida;
        invoiceInline.InvoicedQuantity.val = item.cantidad;

        // set LineExtensionAmount
        invoiceInline.LineExtensionAmount = {
            att: {
                currencyID: reqBody.moneda
            },
            val: valor_venta
        }

        // set PricingReference
        invoiceInline.PricingReference.AlternativeConditionPrice.PriceAmount = {
            att: {
                currencyID: reqBody.moneda
            },
            val: item.precio_unitario.monto
        }
        invoiceInline.PricingReference.AlternativeConditionPrice.PriceTypeCode.val = 1;

        // 2 Set AllowanceCharge
        if (item.descuento) {
            invoiceInline.AllowanceCharge = {
                ChargeIndicator: false,
                AllowanceChargeReasonCode: 0,
                MultiplierFactorNumeric: item.descuento.factor,
                Amount: {
                    att: {
                        currencyID: reqBody.moneda
                    },
                    val: descuento //3
                },
                BaseAmount: {
                    att: {
                        currencyID: reqBody.moneda
                    },
                    val: valor_venta_bruto
                }

            }
        }

        // set TaxTotal
        invoiceInline.TaxTotal.TaxAmount = {
            att: {
                currencyID: reqBody.moneda
            },
            val: IGV //5
        }

        invoiceInline.TaxTotal.TaxSubTotal.TaxableAmount = {
            att: {
                currencyID: reqBody.moneda,
            },
            val: valor_venta //4
        }

        invoiceInline.TaxTotal.TaxSubTotal.TaxAmount = {
            att: {
                currencyID: reqBody.moneda,
            },
            val: IGV //5
        };

        TaxCat = invoiceInline.TaxTotal.TaxSubTotal.TaxCategory;

        TaxCat.ID.val = "S";
        TaxCat.Percent = 18;
        TaxCat.TaxExemptionReasonCode.val = 10;
        TaxCat.TaxScheme.ID.val = 1000;
        TaxCat.TaxScheme.Name = 'IGV';
        TaxCat.TaxScheme.TaxTypeCode = 'VAT';

        invoiceInline.TaxTotal.TaxSubTotal.TaxCategory = TaxCat;

        // set Item
        invoiceInline.Item.Description = product.descripcion;
        invoiceInline.Item.SellersItemIdentification.ID = product.cod;
        invoiceInline.Item.CommodityClassification.ItemClassificationCode.val = 'PLACEHOLDER'

        // 1 set Price
        invoiceInline.Price = {
            PriceAmount: {
                att: {
                    CurrencyId: reqBody.moneda
                },
                val: unitValue
            }
        };

        return invoiceInline;
    });
    return Promise.all(invoiceInlines).then(inlines => { return inlines });
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

exports.calculate_totals = (bill, sumValues, descuentoGlobal) => {

    let factor = 0;
    if(descuentoGlobal.factor){
        factor = descuentoGlobal.factor;
    }
    
    let totalItemsGravados = 0;
    let totalItemsExonerados = 0;
    let totalItemsInafectos = 0;
    //totalItemsGratuitos = 0;

    bill.InvoiceInline.forEach(inline => {
        taxSchemeID = inline.TaxTotal.TaxSubTotal.TaxCategory.TaxScheme.ID.val;
        taxableAmount = inline.TaxTotal.TaxSubTotal.TaxableAmount.val;

        sumValues.sumValorVentaBruto += inline.AllowanceCharge.BaseAmount.val;
        sumValues.sumDescuentosPorItem += inline.AllowanceCharge.Amount.val;
        sumValues.sumValorVentaPorItem += inline.TaxTotal.TaxSubTotal.TaxableAmount.val;
        sumValues.sumIGV += inline.TaxTotal.TaxAmount.val;
        if (taxSchemeID === 1000) {
            totalItemsGravados += taxableAmount;
        } else if (taxSchemeID === 9997) {
            totalItemsExonerados += taxableAmount;
        } else if (taxSchemeID === 9998) {
            totalItemsInafectos += inline.InvoicedQuantity.val * inline.InvoicedQuantity.PriceAmount.val
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

exports.setTaxSubTotals = (bill, sumValues) => {

    bill.TaxTotal.TaxAmount.val = sumValues.sumIGV;
    currency = bill.DocumentCurrencyCode.val;
    taxSubTotalArray = []
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

setTaxableAmount = (currency, amount) => {
    return TaxableAmount = {
        att: {
            currencyID: currency,
        },
        val: amount
    }
}

setTaxAmount = (currency, amount) => {
    return TaxAmount = {
        att: {
            currencyID: currency,
        },
        val: amount
    }
}

setTaxCategory = (taxCategory, id, taxSchemeID, name, typecode) => {

    taxCategory.ID.val = id;
    taxCategory.TaxScheme.ID.val = taxSchemeID;
    taxCategory.TaxScheme.Name = name;
    taxCategory.TaxScheme.TaxTypeCode = typecode;

    return taxCategory;
}

exports.setLegalMonetaryTotal = (bill, sumValues) => {
    currency = bill.DocumentCurrencyCode.val;

    bill.LegalMonetaryTotal = {
        LineExtensionAmount: {
            att: {
                currencyID: currency
            },
            val: sumValues.sumValorVentaBruto
        }, TaxInclusiveAmount : {
            att: {
                currencyID: currency
            },
            val: sumValues.total
        }, AllowanceTotalAmount : {
            att: {
                currencyID: currency
            },
            val: sumValues.totalDescuentos
        }, PayableAmount : {
            att: {
                currencyID: currency
            },
            val: sumValues.total
        }
    }

    return bill;
}

exports.simplify = (bill) => {

    const items = bill.InvoiceInline.map(inline => {
        return item = SimpleBill.createItem({
            cod_medida: inline.InvoicedQuantity.att.unitCode,
            cantidad: inline.InvoicedQuantity.val,
            descripcion: inline.Item.Description,
            precio_unitario: inline.PricingReference.AlternativeConditionPrice.PriceAmount.val,
            IGV: inline.TaxTotal.TaxAmount.val,
            cod: inline.Item.SellersItemIdentification.ID,
            factor_descuento: inline.AllowanceCharge.MultiplierFactorNumeric
        })
    })

    simpleBill = SimpleBill.createBill({
        ID: bill.ID,
        issueDate: bill.IssueDate,
        cond_pago: bill.cond_pago,
        dueDate: bill.DueDate,
        items: items,
        op_gravadas: bill.sumValues.totalOperacionesGravadas,
        op_exoneradas: bill.sumValues.totalOperacionesExoneradas,
        op_inafectas: 0,
        op_gratuitas: bill.sumValues.totalOperacionesInafectas,
        IGV: bill.sumValues.sumIGV,
        otros_trib: 0,
        total_descuentos: bill.sumValues.totalDescuentos,
        importe_total: bill.sumValues.total, // 27
        moneda: bill.DocumentCurrencyCode.val, // 28
        guia_remision: bill.DespatchDocumentReference.ID,
        otro_doc: bill.AdditionalDocumentReference.ID,
        leyenda: bill.Note.val,
        descuento_global: {
            factor: bill.AllowanceCharge.MultiplierFactorNumeric,
            monto: bill.sumValues.descuentoGlobal
        },
        cliente: {
            ruc: bill.AccountingCustomerParty.Party.PartyTaxScheme.CompanyID.val,
            registrationName: bill.AccountingCustomerParty.Party.PartyTaxScheme.RegistrationName
        }
    });

    return simpleBill;
}