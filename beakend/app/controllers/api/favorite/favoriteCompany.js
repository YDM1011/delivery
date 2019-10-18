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
    router.post('/favoriteProduct', [backendApp.middlewares.isLoggedIn], (req, res, next) => {
        const Order = backendApp.mongoose.model('Order');
        const Client = backendApp.mongoose.model('Client');
        console.log(req.body.productId)
        Order
            .findOne({_id:req.body.productId})
            .exec((e,r)=>{
                if(e) return res.serverError(e);
                if(!r) return res.badRequest("Not valid Product!");

                Client
                    .findOneAndUpdate({$and:[
                            {_id:req.user._id},
                            {favoriteProduct: {$in:req.body.productId}}
                    ]},
                    {$pull:{favoriteProduct:req.body.productId}}, {new:true})
                    .exec((e,r)=>{
                        if(e) return res.serverError(e);
                        if(r) return res.ok(r.favoriteProduct);

                        Client
                            .findOneAndUpdate({_id:req.user._id},
                                {$push:{favoriteProduct:req.body.productId}}, {new:true})
                            .exec((e,r)=>{
                                if(e) return res.serverError(e);
                                if(!r) return res.serverError("Not valid Company!");

                                res.ok(r.favoriteProduct);
                            })
                    })
            })

    });
};