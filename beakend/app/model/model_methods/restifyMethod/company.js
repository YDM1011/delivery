module.exports.preUpdate = (req, res, next, backendApp) => {
    if (!req.body.$push) return next();

    backendApp.mongoose.model(req.erm.model.modelName)
        .findOneAndUpdate({_id:req.params.id}, {$push:req.body.$push}, {new:true})
        .exec((e,r)=>{
            next()
        })
};
