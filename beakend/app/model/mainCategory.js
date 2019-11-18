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
    subCategory: [{type: String}],
    brands: [{
        type: Schema.Types.ObjectId,
        ref: "Brand",
        default: null
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
schem.post('findOneAndRemove', (doc, next)=>{
    const key = doc.name;
    const translator = mongoose.model('Translator');
    translator.findOneAndRemove({value: key}).exec((e,r)=>{
        if (e) return next(e);
            next()
    });
});
mongoose.model('MainCategory', schem);
