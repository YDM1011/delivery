module.exports.preSave = async (req,res,next, backendApp) => {
    if (req.body.companyOwner) {
        backendApp.mongoose.model('Company')
            .findOne({_id:req.body.companyOwner})
            .select('cityLink')
            .exec((e,r1)=>{
                if (e) return res.serverError(e);
                if (!r1) return res.notFound("Not Found Category");
                req.body['cityLink'] = r1.cityLink;
                next()
            })
    } else {
        next()
    }
};