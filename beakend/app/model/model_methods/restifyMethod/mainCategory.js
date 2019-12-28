module.exports.postUpdate = async (req, res, next, backendApp) => {
    try {
        let category = req.erm.result;
        const MainCategory = backendApp.mongoose.model('MainCategory');
        MainCategory.findOne({_id:category._id})
            .populate({path:'brands'})
            .exec((e,r)=>{
            if (e) return res.serverError(e);
            if (!r) return res.notFound("not Found");
            if (r) res.ok(r)
        });
    } catch(e) {
        res.notFound("Can't be create")
    }
};