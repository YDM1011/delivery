const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var CustomFieldValidator = require(__dirname + "/../lib/custom-fields-validator");

const user = new Schema({
    login: {type: String, unique: true, required: [true, "Login must be created"]},
    pass: {type: String, required: [true, "Password must be created"]},
    firstName: {type: String},
    lastName: {type: String},
    email: String,
    token: String,
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
    preRead: (doc,ret)=> {
        console.log("gg")
    },
    createRestApi: true,
    strict: true,
    sa: [{public:true}],
});
require("./model_methods/object/user")(user);
// user.plugin(CustomFieldValidator, {});
const User = mongoose.model('User', user);
