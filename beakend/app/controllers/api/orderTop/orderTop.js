module.exports = (backendApp, router) => {

    router.post('/orderTop/:id', [backendApp.middlewares.isLoggedIn, backendApp.middlewares.checkOwner], (req,res,next) => {
        const Order = backendApp.mongoose.model("Order");
        Order.find({companyOwner:req.user.companyOwner, isTop:true})
            .limit(3)
            .exec((e,r)=>{
                if(e) return res.serverError(e);
                if(!r) return res.badRequest("badRequest");
                if(req.body.isTop === true) {
                    if (r.length < 3) {
                        Order.findOneAndUpdate({_id: req.params.id}, {isTop:req.body.isTop}, {new:true})
                            .exec((e,r)=>{
                                if(e) return res.serverError(e);
                                if(!r) return res.badRequest("badRequest");
                                if(r) res.ok(r)
                            })
                    } else {
                        res.notFound('no more 3 tops')
                    }
                } else {
                    Order.findOneAndUpdate({_id: req.params.id}, {isTop:req.body.isTop}, {new:true})
                        .exec((e,r)=>{
                            if(e) return res.serverError(e);
                            if(!r) return res.badRequest("badRequest");
                            if(r) res.ok(r)
                        })
                }

            })
    });
};
