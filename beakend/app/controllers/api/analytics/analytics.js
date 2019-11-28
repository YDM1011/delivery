
module.exports = (backendApp, router) => {

    router.post('/companyVisit', [backendApp.middlewares.isLoggedIn], (req, res, next) => {

        if (req.user.role !== 'client') return res.badRequest("bad request");
        if (!req.body.company) return res.badRequest("bad request");

        const Company = backendApp.mongoose.model("Company");
        const Client = backendApp.mongoose.model("Client");
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
                        Analytic
                            .findOneAndUpdate({
                                companyOwner: r._id,
                                visitedBy: req.user._id,
                                date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                            }, {$inc:{count:1}})
                    } else {
                        Analytic
                            .create({
                                createdBy: r.createdBy,
                                companyOwner: r._id,
                                visitedBy: req.user._id,
                                count: 1,
                                date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                            }, (e,r)=>{

                            })
                    }
                });


            });

    });

};
