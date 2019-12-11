const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schem = new Schema({
    name: {type: String, required: [true, "Category Name is required and unique"]},
    orders: [{
        type: Schema.Types.ObjectId,
        ref: "Order"
    }],
    mainCategory: {
        type: Schema.Types.ObjectId,
        ref: "MainCategory"
    },
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
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
        }
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
        read: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        }],
        update: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        }],
        create: [{private:true}],
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
        read: [{public:true}],
        update: [
            {
                model:'Company',
                _id: 'companyOwner',
                canBeId: [
                    {type:'refObj', fieldName: 'createdBy'},
                    {type:'array', fieldName: 'collaborators'}
                ]
            }
        ],
        create: [{private:true}],
        delete: [{private:true}],
    },
});

schem.post('save', (doc, next)=>{
    const key = doc.name;
    const translator = mongoose.model('Translator');
    translator.findOne({value: key}).exec((e,r)=>{
        if (e) return next(e);
        if (!r) {
            translator.create({value: key}, (e,r)=>{
                if (e) return next(e);
                next()
            })
        } else {
            next()
        }
    });
});
schem.post('save', (doc, next)=>{
    mongoose.model('Company')
        .findOneAndUpdate({_id: doc.companyOwner}, {$push:{
                categories:doc._id,
                mainCategories:doc.mainCategory,
            }})
        .exec((e,r)=>{
            next()
        })
});
// schem.post('save', (doc, next)=>{
//     const key = doc.name;
//     const translator = mongoose.model('Translator');
//     translator.findOne({value: key}).exec((e,r)=>{
//         if (e) return next(e);
//         if (!r) {
//             translator.create({value: key}, (e,r)=>{
//                 if (e) return next(e);
//                 next()
//             })
//         } else {
//             next()
//         }
//     });
// });

schem.post('findOneAndRemove', (doc,next) => {
    mongoose.model('Company')
        .findOneAndUpdate(
            { "categories": doc._id },
            { "$unset": { "categories.$": "" } },
            { "multi": true },
            (e,r) => {
                mongoose.model('Company')
                    .findOneAndUpdate(
                        { "categories": null },
                        { "$pull": { "categories": null } },
                        { "multi": true },
                        (e,r) => {
                            next()
                        }
                    )
            }
        )
});
schem.post('findOneAndRemove', (doc,next) => {
    mongoose.model('Company')
        .findOneAndUpdate(
            { "mainCategories": doc.mainCategory },
            { "$unset": { "mainCategories.$": "" } },
            { "multi": true },
            (e,r) => {
                mongoose.model('Company')
                    .findOneAndUpdate(
                        { "mainCategories": null },
                        { "$pull": { "mainCategories": null } },
                        { "multi": true },
                        (e,r) => {
                            next()
                        }
                    )
            }
        )
});

mongoose.model('Category', schem);
