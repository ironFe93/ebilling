import {Item} from './item'    

    export class Cart {
        _id: number;
        last_modified: Date;
        status: string;
        items: Item[];
    }