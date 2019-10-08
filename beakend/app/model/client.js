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
    mobile: String,
    smsCode: String,
    name: String,
    img: {type: String, default: ''},
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
    debtors: [{
        type: Schema.Types.ObjectId,
        ref: "Debtor"
    }],
    action: [{
        type: Schema.Types.ObjectId,
        ref: "Action"
    }],
    role: String, /** Client Provider Collaborator** Admin* **/
    verify: {type: Boolean, default: false},
    banned: {type: Boolean, default: false},
    verifyCode: String,
    token: String,
    date: {type: Date, default: new Date()},
    lastUpdate: {type: Date, default: new Date()},
},{
    toJSON: {
        transform: function (doc, ret) {
            delete ret.pass;
            delete ret.token;
            delete ret.smsCode;
        }
    },
    toObject: {
        transform: function (doc, ret) {
            delete ret.pass;
            delete ret.token;
            delete ret.smsCode;
        },
        virtuals: true,
    },
    createRestApi: true,
    strict: true,
    needLogined: true,
    sa: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    },
    client: {
        read: [{public:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    provider: {
        read: [{public:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    collaborator: {
        read: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        },{
            model:'Client',
            _id: '_id',
            canBeId: [
                {type:'refObj', fieldName: '_id'}
            ]
        }],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    notCreate: true
});

schem.post('findOneAndRemove', (doc,next)=>{
    next()
});

require("./model_methods/object/client")(schem);
mongoose.model('Client', schem);
