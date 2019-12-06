
module.exports = (backendApp, router) => {

    /**
     * company -> companyOwner
     * r -> createdBy
     * r.u._id -> visitedBy
     * <today 00:00> -> date
     */
    router.post('/companyVisit', [backendApp.middlewares.isLoggedIn], (req, res, next) => {

        if (req.user.role !== 'client') return res.badRequest("bad request");
        if (!req.body.company) return res.badRequest("bad request");

        const Company = backendApp.mongoose.model("Company");
        const Analytic = backendApp.mongoose.model("Analytic");

        Company
            .findOne({_id:req.body.company})
            .exec((e,r)=>{
                if (e) return res.serverError(e);
                if (!r) return res.badRequest("bad request");

                Analytic
                    .findOne({
                        companyOwner: r._id,
                        visitedBy: req.user._id,
                        date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                    }).exec((err,isR)=>{
                    if (err) return res.serverError(err);
                    if (isR) {
                        let isByin = false;
                        let arr = [];
                        req.user.byin.forEach(it=>{
                            arr.push(String(it))
                        });
                        if (arr.indexOf(String(r._id)) > - 1) {
                            isByin = true;
                        }
                        if (req.body.product){

                            Analytic
                                .findOne({
                                    "visit.product": req.body.product,
                                    companyOwner: r._id,
                                    visitedBy: req.user._id,
                                    date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                                })
                                .exec((e,r1)=>{
                                    if (e) return res.serverError(e);
                                    if (r1) {
                                        Analytic
                                            .findOneAndUpdate({
                                                "visit.product": req.body.product,
                                                companyOwner: r._id,
                                                visitedBy: req.user._id,
                                                date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                                            }, {isByin: isByin, $inc: { "visit.$.count" : 1 }})
                                            .exec((e,r)=>{
                                                console.log(e,r)
                                                if (e) return res.serverError(e);
                                                res.ok({})
                                            })
                                    } else {
                                        Analytic
                                            .findOneAndUpdate({
                                                companyOwner: r._id,

                                                visitedBy: req.user._id,
                                                date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                                            }, {isByin: isByin, $push: { visit : {
                                                    count: 1,
                                                    product: req.body.product,
                                                    date: new Date()
                                                }
                                            }})
                                            .exec((e,r)=>{
                                                console.log(e,r)
                                                if (e) return res.serverError(e);
                                                res.ok({})
                                            })
                                    }
                                });

                        }else {
                            Analytic
                                .findOneAndUpdate({
                                    companyOwner: r._id,
                                    visitedBy: req.user._id,
                                    date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                                }, {$inc:{count:1},isByin: isByin,})
                                .exec((e,r)=>{
                                    if (e) return res.serverError(e);
                                    res.ok({})
                                })
                        }

                    } else {
                        let obj = {
                            createdBy: r.createdBy,
                            companyOwner: r._id,
                            visitedBy: req.user._id,
                            count: 1,
                            date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                        };
                        if (req.body.product) {
                            obj['visit'] = [];
                            obj['visit'].push({
                                date: new Date(),
                                product: req.body.product,
                                count: 1
                            })
                        }
                        if (req.user.byin.indexOf(r._id) > - 1) {
                            obj['isByin'] = true;
                        }
                        Analytic
                            .create(obj, (e,r)=>{
                                if (e) return res.serverError(e);
                                res.ok({})
                            })
                    }
                });


            });

    });

};
