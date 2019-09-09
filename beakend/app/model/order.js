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

schema.post('save', (doc,next)=>{
    mongoose.model('Category')
        .findOneAndUpdate({_id:doc.categoryOwner},{$push:{product:doc._id}})
        .exec((err,r)=>{
            next()
        })
});

schema.post('find', (doc,next)=>{
    const Setting = backendApp.mongoose.model('Setting');
    Setting.findOne({})
        .exec((e,r)=>{
            if (r){
                doc.map(it=>{
                    if(r.percentage || (r.percentage == 0)) it.price = ((r.percentage*it.price)/100) +  it.price;
                });
                next()
            }
        });
});

schema.post('remove', (doc) => {
    console.log(doc)
    mongoose.model('Category')
        .findOneAndUpdate({_id:doc.categoryOwner},{$pull:{product:doc._id}})
        .exec((err,r)=>{
            // next()
        })
});

schema.post('findOneAndRemove', (doc) => {
    console.log(doc)
    mongoose.model('Category')
        .findOneAndUpdate({_id:doc.categoryOwner},{$pull:{product:doc._id}})
        .exec((err,r)=>{
            // next()
        })
});

mongoose.model('Order', schema);

