const express = require('express');
const routes = express.Router();
const { celebrate, Joi, errors } = require('celebrate');

const Bill = require('../models/bill');
const Company = require('../models/company');
const Counters = require('../models/counters');
const Product = require('../models/product');


routes.get('/', (req, res, next) => {
    res.status(200).json({ message: 'bills!' });
});

// get a list of bills
routes.get('/get/:_id', (req, res, next) => {
    Bill.find({ '_id': req.params._id }, '_id status', function (err, bills) {
        if (err) return next(err);
        res.send(bills);
    });
});

// get a bill fully detailed
routes.get('/getDetail/:_id', (req, res, next) => {

    Bill.findById(req.params._id, (err, bill) => {
        if (err) return next(err);
        res.send(bill);
    });
});

// Joi validation with Celebrate libary
routes.post('/saveDraft', async (req, res, next) => {

    const query = Company.findOne({ type: 'owner' });

    const company = await query.exec()
        .then(
            res => {
                return res;
            }
        ).catch(err => next(err));

    let bill = new Bill(req.body);
    //bill.fecha_emision = Date.now();
    bill.firma.ds_signature = '67381dhkkjnkbcjb398hd'
    bill.firma.cac_signature = '7617268712987128919287219'
    bill.emisor = company;

    // set the id number and series
    try {
        bill.cod = await getNextSequence('bill_id');
    } catch (error) {
        next(error);
    }


    //process items, quantity, price and taxes and totals
    try {
        bill.items = await calculate_invoice_inline(bill.items);
        bill = calculate_totals(bill);
    } catch (error) {
        next(error);
    }

    promise = bill.save();
    promise.then((err, bill) => {
        if (err) return next(err);
        res.send(bill);
    });
});

const getNextSequence = (name) => {

    query = Counters.findOneAndUpdate(
        {
            prefix: name
        },
        {
            $inc: { seq: 1 },
            new: true
        }
    );

    return query.exec()
        .then(
            x => {
                // control overflow of seq
                if (x.seq === 99999999) {
                    Counters.findOneAndUpdate(
                        { _id: name },
                        { $inc: { ser: 1 }, seq: 0 },
                    );
                }
                cod = x.letter + x.ser + '-' + x.seq;
                return cod;
            }
        ).catch(err => { return err });
}

calculate_invoice_inline = async (items) => {
    const newItems = await items.map(async item => {
        const query = Product.findOne({cod: item.cod});
        try {
            res = await query.exec()
                .then(
                    res => { return res }
                ).catch(
                    err => {return err}
                );
        } catch (err) {
            return err;
        }

        item.cod_medida = res.cod_medida;
        item.descripcion = res.descripcion;
        item.IGV = set_type_tax(item);

        if (item.IGV.afectacion_tipo === 10) {
            item.valor_unitario = calculate_unit_value(item.precio_unitario.monto);
            item.valor_venta_bruto = calculate_valor_v_bruto(item);
            item.descuento.monto = calculate_discount(item);
            item.valor_venta = calculate_valor_venta(item);
            item.IGV.tax_linea = calculate_taxes_IGV(item);
        } else if (item.IGV.afectacion_tipo === 20) {
            item.valor_unitario = item.precio_unitario.monto;
            item.valor_venta_bruto = calculate_valor_v_bruto(item);
            item.descuento.monto = calculate_discount(item);
            item.valor_venta = calculate_valor_venta(item);
            item.IGV.tax_linea = 0;
        } else if (item.IGV.afectacion_tipo === 31) {
            item.valor_unitario = 0;
            item.valor_venta_bruto = 0;
            item.descuento.monto = 0;
            item.valor_venta = 0;
            item.IGV.tax_linea = 0;
        }

        return item;
    });
    return Promise.all(newItems).then(items => {return items});
}

calculate_unit_value = (precio_unit) => {
    return precio_unit / 1.18
}

calculate_valor_v_bruto = (item) => {
    return item.valor_unitario * item.cantidad;
}

calculate_discount = (item) => {
    if (item.descuento.factor) {
        return item.valor_venta_bruto * item.descuento.factor
    } else {
        return 0;
    }

}

calculate_valor_venta = (item) => {
    return item.valor_venta_bruto - item.descuento.monto
}

calculate_taxes_IGV = (item) => {
    return item.valor_venta * 0.18;
}

set_type_tax = (item) => {
    item.IGV.cod_trib = 1000;
    item.IGV.nombre_trib = 'IGV';
    item.IGV.cod_intl = 'VAT';

    return item.IGV;
}

calculate_totals = (bill) => {
    let desc_x_item_acum = 0;
    let valor_venta_pre_glob = 0;
    let igv_total = 0;
    let total_op_grav = 0;
    let total_op_exon = 0;
    let total_op_inaf = 0;
    let total_op_grat = 0;

    bill.items.forEach(item => {
        desc_x_item_acum += item.descuento.monto;
        valor_venta_pre_glob += item.valor_venta;
        if (item.IGV.afectacion_tipo < 20) {
            total_op_grav += item.valor_venta * (1 - bill.descuento_global.factor); //6
        } else if (item.IGV.afectacion_tipo < 22) {
            total_op_exon += item.valor_venta * (1 - bill.descuento_global.factor); //7
        }
        igv_total += item.IGV.tax_linea; //8

        if (item.valor_ref_unitario.monto) {
            total_op_grat += item.valor_ref_unitario.monto;
        }

    });

    bill.descuento_global.monto = bill.descuento_global.factor * valor_venta_pre_glob;

    bill.total_valor_venta.op_gravadas = total_op_grav; //6
    bill.total_valor_venta.op_exoneradas = total_op_exon; //7
    bill.total_valor_venta.op_inafectas = total_op_inaf;
    bill.total_valor_venta.op_gratuitas = total_op_grat;
    bill.sum_IGV.monto = igv_total; //8
    bill.importe_total_venta = total_op_grav + total_op_exon + igv_total; //9
    bill.total_descuentos.monto = desc_x_item_acum + valor_venta_pre_glob * bill.descuento_global.monto;

    return bill;
}
module.exports = routes;
