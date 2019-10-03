const mongoose = require('mongoose');
const Company = mongoose.model('Company');
const Client = mongoose.model('Client');

module.exports = class Signup {
    constructor (req, res, result) {
        this.req = req;
        this.res = res;
        this.result = result;
    }

    end () {
        if (this.result.role === 'provider') {
            if (this.validator()) return this.createCompany();
            this.res.badRequest('Error');
        } else {
            this.res.ok(this.result)
        }
    }
    createCompany(){
        Company.create({
            city:this.req.companyBody.city,
            name:this.req.companyBody.name,
            address:this.req.companyBody.address
        }, (e,r)=>{
            if (e) return this.res.serverError(e);
            if (!r) return this.res.badRequest();
            this.res.ok(this.result)
        })
    }
    validator() {
        if (!this.req.companyBody.city || !this.req.companyBody.name || !this.req.companyBody.address) {
            Client.findOneAndRemove({_id: this.result._id}).exec((e,r)=>{ });
            return false
        } else {
           return true
        }
    }
};