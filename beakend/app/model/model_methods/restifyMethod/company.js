module.exports.preUpdate = (req, res, next, backendApp) => {
    if (req.body.city) {
        backendApp.mongoose.model('Company')
            .findOne({_id: req.params.id})
            .exec((e,r)=>{
                if (!r || e) res.serverError();
                backendApp.mongoose.model('cityLink')
                    .findOneAndUpdate({_id: r.cityLink}, {cityOwner: req.body.city})
                    .exec((e1,r1)=>{
                        backendApp.mongoose.model('City')
                            .findOneAndUpdate({links:{$in:r.cityLink}}, {$pull:{links: r.cityLink}})
                            .exec((e2,r2)=>{
                                backendApp.mongoose.model('City')
                                    .findOneAndUpdate({_id:req.body.city}, {$push:{links: r.cityLink}})
                                    .exec((e3,r3)=>{
                                        next()
                                    })
                            })
                    })
            })

    } else {
        next()
    }
};
