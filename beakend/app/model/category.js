const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schem = new Schema({
    name: {type: String, unique: true, required: [true, "Category Name is required and unique"]},
    icon: {type: String},
    orders: [{
        type: Schema.Types.ObjectId,
        ref: "Order"
    }],
    mainCategory: {
        type: Schema.Types.ObjectId,
        ref: "MainCategory"
    },
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
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
        }
    },
    createRestApi: true,
    strict: true,
});

mongoose.model('Category', schem);
