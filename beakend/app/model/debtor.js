const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    clientOwner: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        required: [true, "Client is required"]
    },
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: [true, "Company is required"]
    },
    basket: {
        type: Schema.Types.ObjectId,
        ref: "Basket"
    },
    login: {type: String, default: ''},
    value: Number,
    dataCall: Date,
    lastUpdate: {type: Date},
    isHidden: {type: Boolean, default: false},
    date: {type: Date, default: new Date()}
},{
    toJSON: {
        transform: function (doc, ret) {

        }
    },
    toObject: {
        transform: function (doc, ret) {

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
        delete: [{private:true}],
    },
    collaborator: {
        read: [{public:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
});
schem.post('save', (doc, next)=>{
    mongoose.model('Company')
        .findOneAndUpdate({_id: doc.companyOwner}, {$push:{debtors:doc._id}})
        .exec((e,r)=>{
            mongoose.model('Client')
                .findOneAndUpdate({_id: doc.clientOwner}, {$push:{debtors:doc._id}})
                .exec((e,r)=>{
                    next()
                })
        })
});
schem.post('findOneAndRemove', (doc,next) => {
    mongoose.model('Company')
        .findOneAndUpdate(
            { "debtors": doc._id },
            { "$unset": { "debtors.$": "" } },
            { "multi": true },
            (e,r) => {
                mongoose.model('Company')
                    .findOneAndUpdate(
                        { "debtors": null },
                        { "$pull": { "debtors": null } },
                        { "multi": true },
                        (e,r) => {
                            mongoose.model('Client')
                                .findOneAndUpdate(
                                    { "debtors": doc._id },
                                    { "$unset": { "debtors.$": "" } },
                                    { "multi": true },
                                    (e,r) => {
                                        mongoose.model('Client')
                                            .findOneAndUpdate(
                                                { "_id": doc.clientOwner },
                                                { "$pull": { "debtors": null } },
                                                (e,r) => {
                                                    next()
                                                }
                                            )
                                    }
                                )
                        }
                    )
            }
        )
});
mongoose.model('Debtor', schem);
