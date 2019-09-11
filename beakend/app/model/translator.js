const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    value: String,
    ua: String,
    ru: String,
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
});

schema.post('find', (doc,next)=>{
   console.log(doc);

   next()
});

mongoose.model('Translator', schema);

