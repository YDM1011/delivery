const mongoose = require('mongoose');
const Company = mongoose.model('Company');
const Client = mongoose.model('Client');
const cityLink = backendApp.mongoose.model("cityLink");

module.exports = class Signup {
    constructor (req, res, result = null, backendApp) {
        this.req = req;
        this.res = res;
        this.result = result;
        this.backendApp = backendApp;
        this.isConfirm;
    }

    async init () {
        console.log(this.result)
        if (!this.result) {
            return this.res.serverError("Result is undefined");
        }
        if (!this.result.verify && (this.result.role === 'provider' || this.result.role === 'client')){
            const token = await backendApp.service.sms.saveToken(this.result._id, backendApp);
            const result = await backendApp.service.sms.send(token, this.result.mobile);
            this.res.ok(result)
        } else
        if (this.result.role === 'provider') {
            if (this.validator()) return this.createCompany();
            this.res.badRequest('Error');
        } else {
            this.res.ok(this.result)
        }
    }
    async confirmSmsCode() {
        this.result = await backendApp.service.sms.confirmSmsCode(this.req, this.res, backendApp);
        this.isConfirm = true;
        if (this.req.body.company) {
            this.req.companyBody = this.req.body.company;
        }
        this.init()
    }
    createCompany() {
        cityLink.create({cityOwner:this.req.companyBody.city}, (e,r)=>{
            if (r) {
                Company.create({
                    city:this.req.companyBody.city,
                    cityLink:r._id,
                    name:this.req.companyBody.name,
                    address:this.req.companyBody.address,
                    createdBy: this.result._id,
                    verify: false
                }, (e,r)=>{
                    if (e) return this.res.serverError(e);
                    if (!r) return this.res.badRequest();
                    Client.findOneAndUpdate({_id: this.result._id}, {$push:{companies: r._id},companyOwner:r._id }).exec((e,r)=>{
                        if (e) return this.res.serverError(e);
                        if (!r) return this.res.notFound("Not found");
                        if (r){
                            if (this.isConfirm) {
                                return r.signin(this.req,this.res,this.backendApp);
                            } else {
                                return this.res.ok(r);
                            }
                        }
                    });
                })
            }
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
