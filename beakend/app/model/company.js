const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const timeRangeSchema = {
    nameDay: String,
    timeStart:  {type: String, default: "8:00"},
    timeEnd: {type: String, default: "20:00"},
    isTimeRange: {type: Boolean, default: true},
    isAllTime: {type: Boolean, default: false},
    isWeekend: {type: Boolean, default: false}
};
const schem = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    name: String,
    debtors: [{
        type: Schema.Types.ObjectId,
        ref: "Debtor"
    }],
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: "Client"
    }],
    address: String,
    categories: [{
        type: Schema.Types.ObjectId,
        ref: "Category"
    }],
    city: {
        type: Schema.Types.ObjectId,
        ref: "City"
    },
    img: String,
    workTime: {
        name: {type: String},
        label: {type: String},
        timeRange1: timeRangeSchema,
        timeRange2: timeRangeSchema,
        timeRange3: timeRangeSchema,
        timeRange4: timeRangeSchema,
        timeRange5: timeRangeSchema,
        timeRange6: timeRangeSchema,
        timeRange7: timeRangeSchema,
    },
    verify: {type: Boolean, default: false},
    updatedAt: {type: Date},
    data: {type: Date, default: new Date()}
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

mongoose.model('Company', schem);
