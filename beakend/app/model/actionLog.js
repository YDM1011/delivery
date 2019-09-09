const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    cleaner:{
        type: Schema.Types.ObjectId,
        ref: "Cleaner"
    },
    delivery:{
        type: Schema.Types.ObjectId,
        ref: "Delivery"
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: "Basket"
    }],
    ordersCount: {type: Number, default: 0},

    ordersOpen: [{
        type: Schema.Types.ObjectId,
        ref: "Basket"
    }],
    ordersOpenCount: {type: Number, default: 0},
    updated: {type: Date, default: new Date()},
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

mongoose.model('ActionLog', schema);

