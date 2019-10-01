const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const schem = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    clientOwner: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    companyOwner: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    // basket: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Basket"
    // },
    value: Number,
    dataCall: Date,
    lastUpdate: {type: Date},
    date: {type: Date, default: new Date()}
},{
    toJSON: {
        transform: function (doc, ret) {

        }
    },
    toObject: {
        transform: function (doc, ret) {

        },
        virtuals: true,
    },
    createRestApi: true,
    strict: true,
    sa: [{public:true}],
    provider: [
        {
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        }, {
            model:'Debtor',
            _id: '_id',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'}
            ]
        }
    ],
});

mongoose.model('Debtor', schem);
