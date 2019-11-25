module.exports.preRead = async (req,res,next, backendApp) => {
    next()
    // return [readStep]
};

module.exports.preSave = async (req,res,next, backendApp) => {
    if (req.body.categoryOwner) {
        backendApp.mongoose.model('Category')
            .findOne({_id:req.body.categoryOwner})
            .select('mainCategory')
            .exec((e,r)=>{
                if (e) return res.serverError(e);
                if (!r) return res.notFound("Not Found Category");
                backendApp.mongoose.model('Company')
                    .findOne({_id:req.body.companyOwner})
                    .select('cityLink')
                    .exec((e,r1)=>{
                        if (e) return res.serverError(e);
                        if (!r1) return res.notFound("Not Found Category");
                        req.body['mainCategory'] = r.mainCategory;
                        req.body['cityLink'] = r1.cityLink;
                        console.log(req.body)
                        next()
                    })
            })
    } else {
        next()
    }
};

module.exports.preUpdate = async (req,res,next, backendApp) => {
    if (req.body.categoryOwner) {
        backendApp.mongoose.model('Category')
            .findOne({_id:req.body.categoryOwner})
            .select('mainCategory')
            .exec((e,r)=>{
                if (e) return res.serverError(e);
                if (!r) return res.notFound("Not Found Category");
                req.body['mainCategory'] = r.mainCategory;
                updateBrand(req,res,next, backendApp)
            })
    } else {
        updateBrand(req,res,next, backendApp)
    }
};

module.exports.preDel = (req, res, next, backendApp) => {
    updateBrand(req, res, next, backendApp)
};

const updateBrand = (req, res, next, backendApp) =>{
    const Company = backendApp.mongoose.model('Company');
    const Order = backendApp.mongoose.model('Order');

    Order.findOne({_id: req.params.id})
        .exec((e,order)=>{
            if (e) return res.serverError(e);
            if (!order) return res.notFound("Not Found!");
            if (!order.brand) return next();
            Company.findOne({_id: order.companyOwner})
            .exec((e,r)=>{
                let obj = r && r.brandCount ? r.brandCount : {};
                if (r && r.brandCount  && r.brandCount[order.brand]) {
                    obj = r.brandCount;
                    obj[order.brand] -= 1;

                    if(obj[order.brand] == 0) {
                        Company.findOneAndUpdate({_id: order.companyOwner}, {
                            $pull:{brands:order.brand},
                        }).exec((e,r)=>{})
                    } else if (obj[order.brand] > 0 && !order.brands.find(element => element == order.brand)){
                        console.log("test",order.brands.find(element => element == order.brand))
                        Company.findOneAndUpdate({_id: order.companyOwner}, {
                            $push:{brands:order.brand},
                        }).exec((e,r)=>{})
                    }
                }
                Company.findOneAndUpdate({_id: order.companyOwner}, {
                        brandCount: obj
                    })
                    .exec((e,r)=>{
                        next()
                    })
            })
        });

};
// const createManeger = (req, backendApp) => {
//     return new Promise((rs,rj)=>{
//
//     })
// };
