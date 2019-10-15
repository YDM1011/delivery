// favoriteCompany
module.exports = function (backendApp, router) {

    router.post('/favoriteCompany', [backendApp.middlewares.isLoggedIn], (req, res, next) => {
        const Company = backendApp.mongoose.model('Company');
        const Client = backendApp.mongoose.model('Client');
        Company
            .findOne({_id:req.body.companyId})
            .exec((e,r)=>{
                if(e) return res.serverError(e);
                if(!r) return res.badRequest("Not valid Company!");

                Client
                    .findOneAndUpdate({$and:[
                            {_id:req.user._id},
                            {favoriteCompany: {$in:req.body.companyId}}
                    ]},
                    {$pull:{favoriteCompany:req.body.companyId}}, {new:true})
                    .exec((e,r)=>{
                        if(e) return res.serverError(e);
                        if(r) return res.ok(r.favoriteCompany);

                        Client
                            .findOneAndUpdate({_id:req.user._id},
                                {$push:{favoriteCompany:req.body.companyId}}, {new:true})
                            .exec((e,r)=>{
                                if(e) return res.serverError(e);
                                if(!r) return res.serverError("Not valid Company!");

                                res.ok(r.favoriteCompany);
                            })
                    })
            })

    });
};