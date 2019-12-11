const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schem = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    count: Number,
    status: Number,
    sum: Number,
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
    createRestApi: true,
    strict: true,
    needLogined: true,
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


mongoose.model('ChartOrder', schem);
