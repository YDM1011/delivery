export interface Basket {
    ownerClient: object;
    ownerCompany: object;
    product: string[];
}

export class BasketObj implements Basket {
    public ownerClient: object = {};
    public ownerCompany: object = {};
    public product: string[] = [];
    constructor() {
        return {
            ownerClient: this.ownerClient,
            ownerCompany: this.ownerCompany,
            product: this.product
        };
    }
}
