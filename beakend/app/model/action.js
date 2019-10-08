const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    description: String,
    img: String,
    client: [{
        type: Schema.Types.ObjectId,
        ref: "Client"
    }],
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    orderOwner: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    },
    actionGlobal: {type: Boolean, default: true},
    updatedAt: {type: Date},
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
schem.post('save', (doc, next)=>{
    mongoose.model('Company')
        .findOneAndUpdate({_id: doc.companyOwner}, {$push:{action:doc._id}})
        .exec((e,r)=>{
            mongoose.model('Order')
                .findOneAndUpdate({_id: doc.orderOwner}, {action:doc._id})
                .exec((e,r)=>{
                    next()
                })
        })

});
schem.post('findOneAndRemove', (doc,next) => {
    mongoose.model('Company')
        .findOneAndUpdate(
            { "action": doc._id },
            { "$unset": { "action.$": "" } },
            { "multi": true },
            (e,r) => {
                mongoose.model('Company')
                    .findOneAndUpdate(
                        { "action": null },
                        { "$pull": { "action": null } },
                        { "multi": true },
                        (e,r) => {
                            mongoose.model('Order')
                                .findOneAndUpdate({_id: doc.orderOwner}, {action:null})
                                .exec((e,r)=>{
                                    next()
                                })
                        }
                    )
            }
        )
});
mongoose.model('Action', schem);
