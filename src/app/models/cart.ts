import {Item} from './item'    

    export class Cart {
        _id: number;
        last_modified: Date;
        status: string;
        grossTotal: number;
        items: [{
            sku: string;
            qty: number;
            title: string;
            listPrice: number
          }];
       
    }