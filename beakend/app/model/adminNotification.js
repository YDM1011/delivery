const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schem = new Schema({
    createdBy: {itemId:{
            type: Schema.Types.ObjectId,
            ref: "Client"
        }},
    cleanerId: {
        type: Schema.Types.ObjectId,
        ref: "Cleaner"
    },
    entity: String,
    amount: Number,
    isNotRead: {type: Boolean, default: true},
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
    strict: false,

});
mongoose.model('adminNotification', schem);
