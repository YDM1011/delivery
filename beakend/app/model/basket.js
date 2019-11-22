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
    isHidden:{
        type: Boolean,
        default: false
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    deliveryAddress: {
        type: Schema.Types.ObjectId,
        ref: "shopAddress"
    },
    payMethod: String,
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
        update: [
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
            }],
        create: [{private:true}],
        delete: [{private:true}],
    },
});

schema.post('save', (doc,next)=>{
    mongoose.model('Basket')
        .count({})
        .exec((e,r)=>{
            mongoose.model('Basket')
                .findOneAndUpdate({_id:doc._id}, {basketNumber: (r)}, {new:true})
                .exec((e,r)=>{
                    next()
                });
        });
});
// schema.post('findOneAndUpdate', (doc,next)=>{
//     if (parseInt(doc.status) != 4) return next();
//     console.log("Status: ", doc.status);
//     let date = new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear()).getTime();
//     mongoose.model('ChartOrder')
//         .findOne({companyOwner:doc.companyOwner, date:{$eq:date}})
//         .exec((e,r)=>{
//             if (e) return next();
//             if (!r || r.length==0){
//                 createChartOrder(doc, next)
//             } else
//             if (r) {
//                 updateChartOrder(doc, r, next)
//             }
//         })
// });
const createChartOrder = (doc, next)=>{
    mongoose.model('Company')
        .findOne({_id: doc.companyOwner})
        .select('createdBy')
        .exec((e,r)=>{
            if (r) {
                mongoose.model('ChartOrder')
                    .create({
                        createdBy: r.createdBy,
                        companyOwner: doc.companyOwner,
                        count: 1,
                        status: doc.status,
                        sum: doc.totalPrice,
                        date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                    }, (e,r)=>{
                        if (e) return next();
                        next()
                    })
            } else {
                next()
            }
        })

};
const updateChartOrder = (doc, ChartOrder, next)=>{
    mongoose.model('ChartOrder')
        .findOneAndUpdate({_id:ChartOrder._id}, {
            $inc:{count: 1, sum: doc.totalPrice},
            status: doc.status
        }, (e,r)=>{
            if (e) return next();
            next()
        })
};
mongoose.model('Basket', schema);

