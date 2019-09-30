const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const permField = new Schema({
    model: String,
    specificId: [],
    specificField: [],
    canRead: Boolean,
    canCreate: Boolean,
    canUpdate: Boolean,
    canDelete: Boolean,
});
const schema = new Schema({
    clientOwner: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    model: String,
    specificId: [],
    specificField: [],
    canRead: Boolean,
    canCreate: Boolean,
    canUpdate: Boolean,
    canDelete: Boolean,
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
    needLogined: true,
    sa: [{public:true}],
});

schema.post('save', (doc, next)=>{
    next()
});
mongoose.model('Permission', schema);

