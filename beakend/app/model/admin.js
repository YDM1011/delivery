const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schem = new Schema({
    login: {type: String, unique: true, required: [true, "Login is required"]},
    pass: {type: String, required: [true, "Password is required"]},
    email: {type: String, required: [true, "Email is required"]},
    card: {
        number: {type: String, default: ''},
        year: {type: String, default: ''},
        month: {type: String, default: ''},
        ccv: {type: String, default: ''}
    },
    token: String,
    verify: {type: Boolean, default: false},
    date: {type: Date, default: new Date()},
    lastUpdate: {type: Date, default: new Date()},
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
    createRestApi: true,
    strict: true,
    notCreate: true,
    sa: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    },
    client: {
        read: [{private:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    provider: {
        read: [{private:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    collaborator: {
        read: [{private:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
});
require("./model_methods/object/admin")(schem);
mongoose.model('Admin', schem);
