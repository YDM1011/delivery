const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    clientOwner: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    rating: Number,
    comment: String,
    show: {
        type: Boolean,
        default: true
    },
    lastUpdate: {type: Date},
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
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    },
    provider: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    },
    collaborator: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    }
});

schem.post('findOneAndUpdate', (doc,next)=>{
    // ratingCount
    if (doc.rating && doc.rating>0) {
        mongoose.model('Company')
            .findOne({_id:doc.companyOwner})
            .exec((e,company)=>{
                if (company){
                    mongoose.model('Company')
                        .findOneAndUpdate({_id:doc.companyOwner}, { $inc: {ratingCount:1, rating:doc.rating} })
                        .exec((e,r)=>next())
                }
            })
    }
});

mongoose.model('Rating', schem);
