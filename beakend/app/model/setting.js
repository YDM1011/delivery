const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdBy: {itemId:{
        type: Schema.Types.ObjectId,
        ref: "Client"
    }},
    city: {
        type: Schema.Types.ObjectId,
        ref: "City",
        default: null
    },
    isAppBlock: Boolean,
    percentage: Number,
    name: String,
    email: String,
    mobile: String,
    fb: String,
    yt: String,
    inst: String,
    des: String,
    footerDes: String,
    metaDes: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Admin"
    },
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
        },
        virtuals: true,
    },
    createRestApi: true,
    strict: true,
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

mongoose.model('Setting', schema);

