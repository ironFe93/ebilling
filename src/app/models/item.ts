export class Item {
    cantidad: number; // 12
    precio_unitario: {  // 15
        monto: number;
        type_code: number
    };
    valor_ref_unitario: {  // 15
        monto: number;
        type_code: number;
    };
    IGV: {
        afectacion_tipo: number
    };
    descuento: {
        factor: number
    };
    cod: string;
    _id: string;
    medida: string;
    descripcion: string;
    tipo: string;

    /*     constructor (qty: number, price: number, igv: number, disc: number, _id: string, val_ref?: number) {
            this.cantidad = qty;
            this.precio_unitario.type_code = 1;
            this.precio_unitario.monto = price;
            this.IGV.afectacion_tipo = igv;
            this.descuento.factor = disc;
            this._id = _id;
            if (val_ref) {
                this.valor_ref_unitario.monto = val_ref;
                this.valor_ref_unitario.type_code = 2;
            }
        } */
}

export interface ItemInterface {
    cantidad: number; // 12
    precio_unitario: {  // 15
        monto: number;
        type_code: number
    };
    valor_ref_unitario: {  // 15
        monto: number;
        type_code: number;
    };
    IGV: {
        afectacion_tipo: number
    };
    descuento: {
        factor: number
    };
    cod: string;
    _id: string;
    medida: string;
    descripcion: string;
    tipo: string;
}
