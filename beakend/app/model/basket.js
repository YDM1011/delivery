const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    basketNumber: {
        type: Number,
        default: 0
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    description: {type: String, default: ''},
    status: {type: Number, default: 0},
    totalPrice: Number,
    basketId: Number,
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
    needLogined: true,
    needAccessControl: true,
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
        read: [
                {
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
                }
        ],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    // client: [{private:true}],
    // provider: [
    //     {
    //         model:'Company',
    //         _id: 'companyOwner',
    //         canBeId: [
    //             {type:'refObj', fieldName: 'createdBy'},
    //             {type:'array', fieldName: 'collaborators'}
    //         ]
    //     },{
    //         model:'Basket',
    //         _id: '_id',
    //         canBeId: [
    //             {type:'refObj', fieldName: 'createdBy'}
    //         ]
    //     }
    // ],
    // collaborator: [
    //     {
    //         model:'Company',
    //         _id: 'companyOwner',
    //         canBeId: [
    //             {type:'refObj', fieldName: 'createdBy'},
    //             {type:'array', fieldName: 'collaborators'}
    //         ]
    //     },{
    //         model:'Basket',
    //         _id: '_id',
    //         canBeId: [
    //             {type:'refObj', fieldName: 'createdBy'}
    //         ]
    //     }
    // ],
    // admin: [{public:true}],
    // sa: [{public:true}],
});

schema.post('save', (doc,next)=>{
    mongoose.model('Basket')
        .findOne({})
        .sort({date:-1})
        .exec((e,r)=>{
            mongoose.model('Basket')
                .findOneAndUpdate({_id:doc._id}, {basketNumber: (r.basketNumber+1)}, {new:true})
                .exec((e,r)=>{
                    next()
                });
        });

});

mongoose.model('Basket', schema);

