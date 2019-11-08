module.exports = (backendApp, router) => {
    /**
     * /providerInfo/5db185fb98138c04b0c2ca32/ 4 / new Date(-3day)  / new Date(now)
     * cityId optional
     * status optional
     * from && to optional
     */
    router.get('/providerInfo/:id/:status/:cityId*?/:from*?/:to*?', [backendApp.middlewares.isLoggedIn], async (req,res,next) => {
        const Company = backendApp.mongoose.model("Company");
        const Client = backendApp.mongoose.model("Client");
        const Basket = backendApp.mongoose.model("Basket");
        let AND = {$and:[]};
        console.log(req.params.cityId,  parseInt(req.params.status), req.params.status);
        if (req.params.cityId != 'all' && req.params.cityId) {
            let companies = await getCompanyByCity(Company, req.params.cityId).catch(e=> res.serverError(e));
            companies.forEach((it,i)=>{
                companies[i] = {companyOwner:it._id};
            });
            AND.$and.push ({ $or: companies});
        }
        if (req.params.from && req.params.to) {
            AND.$and.push({$gte: {lastUpdate: from}});
            AND.$and.push({$lt: {lastUpdate:to}});
        }
        if (req.params.status) AND.$and.push ({ status: parseInt(req.params.status)});
        if ((req.user.role === 'sa' || req.user.role === 'admin') && req.params.id === 'all'){
            callDB(Basket, AND, res)
        } else if((req.user.role === 'sa' || req.user.role === 'admin') && req.params.id !== 'all'){
            AND.$and.push({companyOwner: backendApp.mongoose.Types.ObjectId(req.params.id)});
            callDB(Basket, AND, res);
        } else if (req.user.role === 'provider') {
            let company = await getCompanyByClient(Client, req.user._id).catch(e=> res.serverError(e));
            AND.$and.push ({companyOwner: company.companyOwner});
            callDB(Basket, AND, res)
        } else {
            res.forbidden("Access denied!")
        }

    });

    /**
     * /providerInfo/byCity/5d808aa3aa71bc25f06ed643/ 4 / new Date(-3day)  / new Date(now)
     * status optional
     * from && to optional
     */
    router.get('/providerInfo/byCity/:cityId/:status*?/:from*?/:to*?', [backendApp.middlewares.isLoggedIn], async (req,res,next) => {
        const Company = backendApp.mongoose.model("Company");
        const Client = backendApp.mongoose.model("Client");
        const Basket = backendApp.mongoose.model("Basket");
        let AND = {$and:[]};
        if (!req.params.cityId) return res.badRequest("badRequest");
        if (req.params.from && req.params.to) {
            AND.$and.push({$gte: {lastUpdate: from}});
            AND.$and.push({$lt: {lastUpdate:to}});
        }
        // else {
        //     AND.$and.push({lastUpdate: {$lt:new Date(new Date().getTime()-14*24*60*60*1000)}});
        // }
        let companies = await getCompanyByCity(Company, req.params.cityId).catch(e=> res.serverError(e));
        companies.forEach((it,i)=>{
            companies[i] = {companyOwner:it._id};
        });
        AND.$and.push ({ $or: companies});
        if (req.params.status) AND.$and.push ({ status: parseInt(req.params.status)});

        if (req.user.role === 'sa' || req.user.role === 'admin'){
            callDB(Basket, AND, res)
        } else if (req.user.role === 'provider') {
            let company = await getCompanyByClient(Client, req.user._id).catch(e=> res.serverError(e));
            AND.$and.push ({companyOwner: company.companyOwner});
            callDB(Basket, AND, res)
        } else {
            res.forbidden("Access denied!")
        }

    });
};

const getCompanyByClient = (Client, id) => {
    return new Promise((rs,rj)=>{
        Client.findById(id).select('companyOwner').exec((e,r)=>{
            if (e) return rj(e);
            if (!r) return rj(new Error("not found"));
            rs (r)
        })
    })
};
const getCompanyByCity = (Company, id) => {
    return new Promise((rs,rj)=>{
        Company.find({city: id}).select('_id').exec((e,r)=>{
            if (e) return rj(e);
            if (!r) return rj(new Error("not found"));
            rs (r)
        })
    })
};

const callDB = (Model, and, res) => {

    Model.aggregate([{ $match:  and },
        { $group: {
                _id : null,
                sum : { $sum: "$totalPrice" },
                count: { $sum: 1 },
            }
        }]).then(r => {
            console.log(and)
            if (r.length === 0) return res.ok({
                _id: null,
                sum: 0,
                count: 0
            });
        res.ok(r)
    }).catch(e => res.serverError(e))
};