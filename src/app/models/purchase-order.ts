// create a schema
export class PurchaseOrder {

    date_placed: Date;
    date_sent: Date;
    provider: String;
    status: String;
    items: {
        sku: String,
        qty: Number,
        title: String
    }[];
};