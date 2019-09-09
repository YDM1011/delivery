const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schem = new Schema({
    login: {type: String, unique: true, required: [true, "Login is required"]},
    pass: {type: String, required: [true, "Password is required"]},
    email: {type: String, required: [true, "Email is required"]},
    token: String,
    verify: {type: Boolean, default: false},
    data: {type: Date, default: new Date()},
    setting: {
            type: Schema.Types.ObjectId,
            ref: "Setting"
        },
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
    createRestApi: false,
    strict: true,

});
require("./model_methods/object/admin")(schem);
mongoose.model('Admin', schem);
