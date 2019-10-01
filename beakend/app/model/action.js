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
    orderOwner: [{
        type: Schema.Types.ObjectId,
        ref: "Order"
    }],
    updatedAt: {type: Date},
    data: {type: Date, default: new Date()}
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

mongoose.model('Action', schem);
