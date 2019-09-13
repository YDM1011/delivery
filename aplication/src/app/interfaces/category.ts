export interface Category {
    name: string;
    orders: string[];
    ownerCategory: any;
    companyOwner: any;
    img: string;
}

export class CategoryObj implements Category {
    public name: string = '';
    public orders: string[] = [];
    public ownerCategory: any = {};
    public companyOwner: any = {};
    public img: string = '';
    constructor() {
        return {
            name: this.name,
            orders: this.orders,
            ownerCategory: this.ownerCategory,
            companyOwner: this.companyOwner,
            img: this.img
        };
    }
}
