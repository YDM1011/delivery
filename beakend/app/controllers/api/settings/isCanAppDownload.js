module.exports = (backendApp, router) => {
    router.get('/isCanAppDownload', [], (req,res,next) => {
        const Setting = backendApp.mongoose.model('Setting');
        Setting.find({})
            .exec((e,r)=>{
                if (e) return res.serverError(e);
                if (r && !r[0]) return res.ok(false);
                if (r && r[0]) return res.ok(r[0].isAppBlock);
            })
    });
};
