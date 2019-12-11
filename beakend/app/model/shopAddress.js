const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    city: {
        type: Schema.Types.ObjectId,
        ref: "City"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    img: String,
    name: String,
    street: String,
    build: String,
    department: String,
    comment: String,
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
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    admin: {
        read: [{public:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    client: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
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
mongoose.model('shopAddress', schem);
