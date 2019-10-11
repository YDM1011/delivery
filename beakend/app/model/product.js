const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    count: Number,
    basketOwner: {
        type: Schema.Types.ObjectId,
        ref: "Basket"
    },
    orderOwner: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Check Order"]
    },
    lastUpdate: {type: Date},
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
    needLogined: true,
    sa: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    },
    client: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{private:true}],
    },
    provider: {
        read: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        }],
        update: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        }],
        create: [{public: true}],
        delete: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        }],
    },
    collaborator: {
        read: [{public:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },

});

schema.post('findOneAndRemove', (doc,next)=>{
    let inc = doc.price*(0-doc.count);
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
        let isProduct = await checker(Prod, products[i]).catch(e=>console.log(e));
        if (canDelet){
            canDelet = !isProduct
        }
        i++
    }
    if (canDelet){
        // next()
        deleteBasket(basket, next)
    }else{
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
