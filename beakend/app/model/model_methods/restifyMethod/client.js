module.exports.preRead = (req,res,next, backendApp) => {
    // let err = backendApp.service.signUpValidator(req.body);
    // if (err) return res.badRequest(err);
    req.body.login = req.body.login.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    next()
};
module.exports.PreDel = (req, res, next, backendApp) => {
    backendApp.mongoose.model('Cleaner')
        .findOneAndUpdate({superManager:req.user._id}, {$pull:{managers: req.params.id}}, {new:true})
        .exec((e,r)=>{
            next()
        })
};
module.exports.preUpdate = (req,res,next, backendApp) => {
    // let err = backendApp.service.signUpValidator(req.body);
    // if (err) return res.badRequest(err);
    delete req.body.createdBy;
    delete req.body._id;
    next()
};