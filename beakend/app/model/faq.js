const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    question: String,
    answer: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Admin"
    },
    lastUpdate: {type: Date, default: new Date()},
    date: {type: Date, default: new Date()}
},{
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.pass;
            delete ret.token;
        }
    },
    toObject: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.pass;
            delete ret.token;
        },
        virtuals: true,
    },
    createRestApi: true,
    strict: true,
    sa: [{public:true}],
});

mongoose.model('Faq', schema);

