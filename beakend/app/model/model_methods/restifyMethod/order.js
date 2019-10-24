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
                    .select('сityLink')
                    .exec((e,r1)=>{
                        if (e) return res.serverError(e);
                        if (!r1) return res.notFound("Not Found Category");
                        req.body['mainCategory'] = r.mainCategory;
                        req.body['сityLink'] = r1.сityLink;
                        console.log(req.body)
                        next()
                    })
            })
    } else {
        next()
    }
};

// const createManeger = (req, backendApp) => {
//     return new Promise((rs,rj)=>{
//
//     })
// };
