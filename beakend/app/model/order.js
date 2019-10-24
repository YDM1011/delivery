const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomField = new Schema({
    name: String,
    value: [String]
});
const schema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    categoryOwner: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Check category"]
    },
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: [true, "Check Company"]
    },
    action: {
        type: Schema.Types.ObjectId,
        ref: "Action"
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand"
    },
    countBought: {
        type: Number,
        default: 0
    },
    subCategory: String,
    name: {type: String, required: [true, "Name is required"]},
    des: String,
    discount: Number,
    price: {type: Number, required: [true, "Price is required"]},
    img: String,
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
    sa: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    },
    client: {
        read: [{public:true}],
        update: [{private:true}],
        create: [{private:true}],
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
        create: [{private:true}],
        delete: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        },{
            model:'Client',
            _id: 'createdBy',
            canBeId: [
                {type:'refObj', fieldName: '_id'}
            ]
        }],
    },
    collaborator: {
        read: [{public:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        }],
    },
});

schema.post('save', (doc,next)=>{
    mongoose.model('Category')
        .findOneAndUpdate({_id:doc.categoryOwner},{$push:{orders:doc._id}})
        .exec((err,r)=>{
            mongoose.model('Brand')
                .findOneAndUpdate({_id:doc.brand},{$push:{orders:doc._id}})
                .exec((err,r)=>{
                    mongoose.model('Company')
                        .findOneAndUpdate({_id: doc.companyOwner}, {
                            $pull:{brands:doc.brand},
                        })
                        .exec((e,r)=>{
                            mongoose.model('Company')
                                .findOneAndUpdate({_id: doc.companyOwner}, {
                                    $push:{brands:doc.brand},
                                })
                                .exec((e,r)=>{
                                    let obj = r && r.brandCount ? r.brandCount : {};
                                    console.log(r.brandCount, doc.brand);
                                    if (r && r.brandCount  && r.brandCount[doc.brand]){
                                        obj = r.brandCount;
                                        obj[doc.brand] += 1;
                                    } else
                                    if (r && (!r.brandCount || !r.brandCount[doc.brand])){
                                        obj[doc.brand] = 1;
                                    }
                                    mongoose.model('Company')
                                        .findOneAndUpdate({_id: doc.companyOwner}, {
                                            brandCount: obj
                                        })
                                        .exec((e,r)=>{
                                            next()
                                        })
                                })
                        })
                })
        });

});

schema.post('findOneAndRemove', (doc,next) => {
    console.log(doc);
    mongoose.model('Category')
        .findOneAndUpdate({_id:doc.categoryOwner},{$pull:{orders:doc._id}})
        .exec((err,r)=>{
            mongoose.model('Brand')
                .findOneAndUpdate({_id:doc.brand},{$pull:{orders:doc._id}})
                .exec((err,r)=>{
                    mongoose.model('Company')
                        .findOneAndUpdate(
                            { "brands": doc.brand },
                            { "$unset": { "brands.$": "" } },
                            { "multi": true },
                            (e,r) => {
                                mongoose.model('Company')
                                    .findOneAndUpdate(
                                        { "brands": null },
                                        { "$pull": { "brands": null } },
                                        { "multi": true },
                                        (e,r) => {
                                            next()
                                        }
                                    )
                            }
                        )
                })
        })
});

mongoose.model('Order', schema);

