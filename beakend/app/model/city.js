const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    name: String,
    img: String,
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
    sa: [{public:true}],
    client: [{public:true}],
    provider: [{public:true}],
    collaborator: [{public:true}],
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
mongoose.model('City', schem);
