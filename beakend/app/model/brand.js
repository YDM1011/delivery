const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    name: {type: String, unique: true},
    img: String,
    orders:[{
        type: Schema.Types.ObjectId,
        ref: "Order"
    }],
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
    admin: {
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
        read: [{public:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
});

mongoose.model('Brand', schem);
