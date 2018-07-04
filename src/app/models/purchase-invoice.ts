// create a schema
export class PurchaseInvoice {
    date: Date;
    provider: String;
    ruc: Number;
    status: String;
    items: {
        sku: String,
        qty: Number,
        title: String
    }[] = []; // This will give you a correctly typed, empty array stored in the variable 'arr'
}
