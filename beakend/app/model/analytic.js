const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    visitedBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    count: Number,
    visit: [{
        date: Date,
        product: {
            type: Schema.Types.ObjectId,
            ref: "Order"
        },
        count: Number
    }],
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
        read: [{private:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    provider: {
        read: [{private:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    collaborator: {
        read: [{private:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
});
mongoose.model('Analytic', schem);
