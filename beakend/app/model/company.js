const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 1 - cleaners
 * 2 - delivery
 * role - manedger 1/2 superManedger 1/2 client
 */
const timeRangeSchema = {
    nameDay: String,
    timeStart:  {type: String, default: "08:00"},
    timeEnd: {type: String, default: "20:00"},
    isTimeRange: {type: Boolean, default: true},
    isAllTime: {type: Boolean, default: false},
    isWeekend: {type: Boolean, default: false}
};
const schem = new Schema({
    companyMobile: {
        type: String,
        default: null
    },
    payInfo: {
        type: Date,
        default: null
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    name: {type: String, required: [true, "Name is required"]},
    debtors: [{
        type: Schema.Types.ObjectId,
        ref: "Debtor"
    }],
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: "Client"
    }],
    address: {type: String, required: [true, "Address is required"]},
    categories: [{
        type: Schema.Types.ObjectId,
        ref: "Category"
    }],
    mainCategories: [{
        type: Schema.Types.ObjectId,
        ref: "MainCategory"
    }],
    brands: [{
        type: Schema.Types.ObjectId,
        ref: "Brand"
    }],
    brandCount:{},
    rating: Number,
    ratingCount: Number,
    action: [{
        type: Schema.Types.ObjectId,
        ref: "Action"
    }],
    city: {
        type: Schema.Types.ObjectId,
        ref: "City",
        required: [true, "City is required"]
    },
    cityLink: {
        type: Schema.Types.ObjectId,
        ref: "cityLink",
        required: [true, "City is required"]
    },
    img: {type: String, default: ''},
    workTime: {
        name: {type: String},
        label: {type: String, default: ''},
        timeRange1: timeRangeSchema,
        timeRange2: timeRangeSchema,
        timeRange3: timeRangeSchema,
        timeRange4: timeRangeSchema,
        timeRange5: timeRangeSchema,
        timeRange6: timeRangeSchema,
        timeRange7: timeRangeSchema,
    },
    verify: {type: Boolean, default: false},
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
        },{
            model:'Client',
            _id: '_id',
            canBeId: [
                {type:'refObj', fieldName: '_id'}
            ]
        }],
        update: [{private:true}],
        create: [{private:true}],
        delete: [{private:true}],
    },
    collaborator: {
        read: [{public:true}],
        update: [{
            model:'Company',
            _id: 'companyOwner',
            canBeId: [
                {type:'refObj', fieldName: 'createdBy'},
                {type:'array', fieldName: 'collaborators'}
            ]
        }],
        create: [{private:true}],
        delete: [{private:true}],
    },

});

mongoose.model('Company', schem);
