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
    name:String,
    mobile:String,
    login:String,
    basketCount: Number,
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    pushDay: [Number],
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
        read: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        },{
            model:'Basket',
            _id: '_id',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'}
            ]
        }],
        update: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        },{
            model:'Basket',
            _id: '_id',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'}
            ]
        }],
        create: [{public: true}],
        delete: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        }],
    },
    collaborator: {
        read: [{private:true}],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    }
});
schem.post('save', (doc,next)=> {
    mongoose.model('Client')
        .findOne({_id:doc.clientOwner})
        .exec((e,r)=>{
            if (r) {
                mongoose.model('companyClient')
                    .findOneAndUpdate({_id:doc._id}, {
                        name: r.name,
                        mobile: r.mobile,
                        login: r.login,
                    }).exec((e,r)=>{
                    console.log(e,r)
                    next()
                })
            } else { next() }
        })
});
mongoose.model('companyClient', schem);
