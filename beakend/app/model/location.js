const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdBy: {itemId:{
            type: Schema.Types.ObjectId,
            ref: "Client"
        }},
    country: {type: String, unique: true, required: [true, "Country is required and unique!"]},
    city: [{type: String, required: [true, "City is required!"]}],
    postCode: String,
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

mongoose.model('Location', schema);

