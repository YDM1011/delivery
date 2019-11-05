const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    clientOwner: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    rating: Number,
    comment: String,
    show: {
        type: Boolean,
        default: true
    },
    lastUpdate: {type: Date},
    date: {type: Date, default: new Date()}
},{
    toJSON: {
        transform: function (doc, ret) {

        }
    },
    toObject: {
        transform: function (doc, ret) {

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
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    },
    provider: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    },
    collaborator: {
        read: [{public:true}],
        update: [{public:true}],
        create: [{public:true}],
        delete: [{public:true}],
    },
    // sa: {
    //     read: [{public:true}],
    //     update: [{public:true}],
    //     create: [{public:true}],
    //     delete: [{public:true}],
    // },
    // client: {
    //     read: [{
    //         model:'Client',
    //         _id: 'clientOwner',
    //         canBeId: [
    //             {type:'refObj', fieldName: '_id'}
    //         ]
    //     }],
    //     update: [{
    //         model:'Client',
    //         _id: 'clientOwner',
    //         canBeId: [
    //             {type:'refObj', fieldName: '_id'}
    //         ]
    //     }],
    //     create: [{private:true}],
    //     delete: [{private:true}],
    // },
    // provider: {
    //     read: [{
    //         model:'Company',
    //         _id: 'companyOwner',
    //         canBeId: [
    //             {type:'refObj', fieldName: 'createdBy'},
    //             {type:'array', fieldName: 'collaborators'}
    //         ]
    //     }],
    //     update: [{private:true}],
    //     create: [{private:true}],
    //     delete: [{private:true}],
    // },
    // collaborator: {
    //     read: [{public:true}],
    //     update: [{private:true}],
    //     create: [{private:true}],
    //     delete: [{private:true}],
    // },
});

mongoose.model('Rating', schem);
