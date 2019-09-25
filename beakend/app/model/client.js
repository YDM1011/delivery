const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    login: {type: String, required: [true, "Login is required"]},
    pass: {type: String, required: [true, "Password is required"]},
    name: String,
    img: String,
    address: String,
    city: {
        type: Schema.Types.ObjectId,
        ref: "City"
    },
    basket: [{
        type: Schema.Types.ObjectId,
        ref: "Basket"
    }],
    companies:[{
        type: Schema.Types.ObjectId,
        ref: "Company"
    }],
    companyOwner:{
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    basketCount: Number,
    favoriteCompany: [{
        type: Schema.Types.ObjectId,
        ref: "Company"
    }],

    favoriteProduct: [{
        type: Schema.Types.ObjectId,
        ref: "Order"
    }],
    debtor: [{
        type: Schema.Types.ObjectId,
        ref: "Debtor"
    }],
    action: [{
        type: Schema.Types.ObjectId,
        ref: "Action"
    }],
    role: String, /** Client Company Collaborator** Admin* **/
    verify: {type: Boolean, default: false},
    verifyCode: String,
    token: String,
    updatedAt: {type: Date},
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
    client: 'byId'
});

schem.post('findOneAndRemove', (doc,next)=>{
    next()
});

require("./model_methods/object/client")(schem);
mongoose.model('Client', schem);
