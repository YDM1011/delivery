const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdBy: {userId:{
        type: Schema.Types.ObjectId,
        ref: "Client"
    }},
    baskets: [{
        type: Schema.Types.ObjectId,
        ref: "Basket"
    }]
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

mongoose.model('BasketGroup', schema);

