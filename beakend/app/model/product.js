const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdBy: {itemId:{
            type: Schema.Types.ObjectId,
            ref: "Client"
        }},
    categoryOwner: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Check category"]
    },
    cleanerOwner: {
        type: Schema.Types.ObjectId,
        ref: "Cleaner",
        required: [true, "Check cleaner"]
    },
    count: Number,
    basketOwner: {
        type: Schema.Types.ObjectId,
        ref: "Basket"
    },
    currentOrder: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Check Order"]
    },
    name: {type: String, required: [true, "Name is required"]},
    des: String,
    price: {type: Number, required: [true, "Price is required"]},
    images: {type: String, required: [true, "Image is required"]},
    date: {type: Date, default: new Date()}
},{
    toJSON: {
        transform: function (doc, ret) {
            delete ret.pass;
            delete ret.token;
        }
    },
    toObject: {
        transform: function (doc, ret) {
            delete ret.pass;
            delete ret.token;
        },
        virtuals: true,
    },
    createRestApi: true,
    strict: true,
});

schema.post('findOneAndRemove', (doc,next)=>{
    let inc = doc.price*(0-doc.count);
    console.log("test",inc);
    mongoose.model('Basket')
        .findOneAndUpdate({_id:doc.basketOwner},
            {$pull:{products:doc._id}, $inc: {totalPrice:inc}},
            { new: true },(err,r)=>{
            if (r){
                console.log(r.products.length, r);
                r.products.length == 0 ? deleteBasket(r, next) : checkIsProduct(r, next);
            }
            // next()
        })
});

mongoose.model('Product', schema);

const deleteBasket = (r, next) =>{
    mongoose.model('Basket')
        .findOneAndRemove({_id:r._id}, (e,r)=>{
            console.log(e,r)
            if (e || !r) return;
            if (r) return next()
        })
};

const checkIsProduct = async (basket, next) => {
    const Prod = mongoose.model('Product');
    let products = basket.products;
    let canDelet = true;
    let i = 0;
    while ( i<products.length){
        console.log("for ", i);
        let isProduct = await checker(Prod, products[i]).catch(e=>console.log(e));
        console.log(isProduct, "test");
        if (canDelet){
            canDelet = !isProduct
        }
        console.log("for ", i, products.length)
        // if (i == products.length) return rs(canDelet);
        console.log("for ", canDelet)
        i++
    }
    console.log("finish and do")
    if (canDelet){
        // next()
        console.log('delet')
        deleteBasket(basket, next)
    }else{
        console.log("Update")
        next();
    }
};

const checker = (Prod, prod) => {
    return new Promise((rs,rj)=>{
        Prod.findOne({_id:prod}).exec((e,r)=>{
            console.log(e,r)
            if (e) return rj(e);
            if (!r) return rs(false);
            if (r) return rs(true)
        })
    });
}