
module.exports = class Transfer {
    constructor (from, to, argument, model, field) {
        this.argument = argument;
        this.from = from;
        this.to = to;
        this.mongoose = require('mongoose');
        this.field = field;
        this.model = model;
        this.validator();
        this.model = this.mongoose.model(model);
    }

    async init() {
        const session = await this.mongoose.startSession();
        session.startTransaction();
        try {
            let obj = {};
            obj[this.field] = -this.argument;
            const opts = {session, new: true};
            const A = await this.model.findOneAndUpdate({name: this.from}, {$inc: obj}, opts);
            if (A[this.field] < 0) {
                return new Error('Insufficient funds: ' + (A[this.model] + this.argument));
            }
            obj[this.field] = this.argument;
            const B = await this.model.findOneAndUpdate({name: this.to}, {$inc: obj}, opts);
            await session.commitTransaction();
            session.endSession();
            return {from: A, to: B};
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return error;
        }
    }



    validator () {
        if (!this.from) console.error("Need 'From' field (argument 0)!");
        if (!this.to) console.error("Need 'To' field (argument 1)!");
        if (!this.argument) console.error("Need 'Argument' field (argument 2)!");
        if (!this.model) console.error("Need 'Model' field (argument 3)!");
        if (!this.field) console.error("Need 'Field' field (argument 4)!");
        if (!this.from || !this.to || !this.argument || !this.model || !this.field){
            process.exit(1);
        }
        return;
    }
};