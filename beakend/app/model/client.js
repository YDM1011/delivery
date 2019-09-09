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
    email: {type: String},
    mobile: {type: String},
    address1: {type: String},
    address2: String,
    country: {type: String},
    cityCode: {type: String},
    city: {type: String},
    basketList: [],
    basketListCount: Number,
    token: String,
    role: String,
    loger:{
        type: Schema.Types.ObjectId,
        ref: "ActionLog"
    },
    data: {type: Date, default: new Date()}
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

schem.post('findOneAndRemove', (doc,next)=>{
    if (doc.role === 'managerCleaner' || doc.role === 'managerDelivery') {
        mongoose.model('ActionLog')
            .findOneAndRemove({owner:doc._id}, (err,r)=>{
                next()
            })
    }
    // if (doc.role === 'superManagerCleaner'){

    // }
});

require("./model_methods/object/client")(schem);
mongoose.model('Client', schem);
