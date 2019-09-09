const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schem = new Schema({
    name: {type: String, unique: true, required: [true, "Category Name is required and unique"]},
    icon: {type: String, required: [true, "Categori's icon is required"]},
    product: [{
        type: Schema.Types.ObjectId,
        ref: "Order"
    }],
    cleaner: {
        type: Schema.Types.ObjectId,
        ref: "Cleaner"
    },
    createdBy: {itemId:{
            type: Schema.Types.ObjectId,
            ref: "Client"
        }},
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
        }
    },
    createRestApi: true,
    strict: true,

});

schem.post('save', (doc,next)=>{
    mongoose.model('Cleaner')
        .findOneAndUpdate({_id:doc.cleaner}, {$push:{category: doc._id}}, {new:true})
        .exec((e,r)=>{
            if (e) return next(e);
            if (!r) return next();
            if (r) return next()
        })
});
schem.post('findOneAndRemove', (doc,next)=>{
    console.log('post Delete' + doc)
    mongoose.model('Cleaner')
        .findOneAndUpdate({_id:doc.cleaner}, {$pull:{category: doc._id}}, {new:true})
        .exec((e,r)=>{
            if (e) return next(e);
            if (!r) return next();
            if (r) return next()
        })
});

mongoose.model('Category', schem);
