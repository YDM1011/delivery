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
    client: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    // basket: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Basket"
    // },
    value: Number,
    dataCall: Date,
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

});

mongoose.model('Debtor', schem);
