// create a schema
export class ProductReq {

    date: Date;
    status: String;
    items: {
        sku: String;
        qty: Number;
        title: String;
        status: String
    }[];

};