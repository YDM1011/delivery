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
    status: Number,
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
    client: [
        {
            isPrivate: false,
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        },{
            isPrivate: false,
            model:'Basket',
            _id: null,
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'}
            ]
        }
    ]
});

mongoose.model('Basket', schema);

