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
    lastUpdate: {type: Date, default: new Date()},
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
    sa: [{public:true}],
});
mongoose.model('adminNotification', schem);
