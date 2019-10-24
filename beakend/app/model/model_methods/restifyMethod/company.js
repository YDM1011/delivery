module.exports.preUpdate = (req, res, next, backendApp) => {
    if (req.body.city) {
        backendApp.mongoose.model('Company')
            .findOne({_id: req.params.id})
            .exec((e,r)=>{
                if (!r || e) res.serverError();
                backendApp.mongoose.model('сityLink')
                    .findOneAndUpdate({_id: r.сityLink}, {cityOwner: req.body.city})
                    .exec((e,r)=>{
                        next()
                    })
            })

    } else {
        next()
    }
};
