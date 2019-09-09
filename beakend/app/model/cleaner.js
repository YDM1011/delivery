const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schem = new Schema({
    name: {type: String, required: [true, "Cleaner Name is required"]},
    country: {type: String, required: [true, "Cleaner country is required"]},
    city: {type: String, required: [true, "Cleaner city is required"]},
    address: {type: String, required: [true, "Cleaner address is required"]},
    images: {type: String},
    category: [{
        type: Schema.Types.ObjectId,
        ref: "Category"
    }],
    superManager: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    managers: [{
        type: Schema.Types.ObjectId,
        ref: "Client"
    }],
    createdBy: {itemId:{
            type: Schema.Types.ObjectId,
            ref: "Client"
        }},
    autoAssign: {type:Boolean, default: false},
    money: Number,
    fs: String,
    inst: String,
    yt: String,
    date: {type: Date, default: new Date()}
},{
    toJSON: {
        transform: function (doc, ret) {

        }
    },
    toObject: {
        transform: function (doc, ret) {

        }
    },
    createRestApi: true,
    strict: true,

});
mongoose.model('Cleaner', schem);
