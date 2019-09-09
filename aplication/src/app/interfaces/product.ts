export interface Product {
    count: number;
    basketOwner: object;
    orderOwner: object;
    clientOwner: object;
}


export class ProductObj implements Product {
    public count: number;
    public basketOwner: object = {};
    public orderOwner: object = {};
    public clientOwner: object = {};
    constructor() {
        return {
            count: this.count,
            basketOwner: this.basketOwner,
            orderOwner: this.orderOwner,
            clientOwner: this.clientOwner
        };
    }
}
