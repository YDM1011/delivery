const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    forClient: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    model: String,
    read: Boolean,
    create: Boolean,
    update: Boolean,
    delete: Boolean,
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
    needLogined: false,
    needBeAdminR: true,
    needBeAdminCUD: true,
    needAccessControl: false
});

schema.post('save', (doc, next)=>{
    next()
});
mongoose.model('Permission', schema);

