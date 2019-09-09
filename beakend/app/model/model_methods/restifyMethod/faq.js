module.exports.preSave = async (req, res, next, backendApp) => {
    try {
        const Admin = backendApp.mongoose.model('Admin');
        console.log(req.user)
        Admin.findOne({_id:req.user._id}).exec((e,r)=>{
            if (e) return res.serverError(e);
            if (!r) return res.notFound("not Found");
            if (r) return next();
        });
    } catch(e) {
        res.notFound("Can't be create")
    }
};