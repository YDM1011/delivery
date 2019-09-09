export interface Category {
    name: string;
    orders: string[];
    ownerCategory: any;
    companyOwner: any;
}

export class CategoryObj implements Category {
    public name: string = '';
    public orders: string[] = [];
    public ownerCategory: any = {};
    public companyOwner: any = {};
    constructor() {
        return {
            name: this.name,
            orders: this.orders,
            ownerCategory: this.ownerCategory,
            companyOwner: this.companyOwner
        };
    }
}
