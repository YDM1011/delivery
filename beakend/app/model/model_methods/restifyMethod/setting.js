module.exports.preSave = async (req, res, next, backendApp) => {
    try {
        const Setting = backendApp.mongoose.model('Setting');
        await isLoggedIn(req,res,backendApp);
        delete req.body._id;
        delete req.body.__v;
        delete req.body.owner;
        delete req.body.createdBy;
        Setting.findOne({owner:req.user._id})
            .exec((e,r)=>{
                console.log(e,r)
                if (e) return res.serverError(e);
                if (!r) {
                    req.body['owner'] = req.user._id;
                    next();
                }
                if (r) {
                    // console.log(r, String(r.owner) == String(req.user._id), String(r.owner), String(req.user._id))
                    if (String(r.owner) == String(req.user._id)){
                        // req.params['id'] = r._id;
                        // next();
                        Setting.findOneAndUpdate({_id: r._id}, req.body, {new:true})
                            .exec((e,r)=>{
                                if (e) return res.serverError(e);
                                if (!r) return res.notFound('Not valid setting');
                                if (r) return res.ok(r);
                            })
                    } else {
                        res.forbidden('firbidden')
                    }

                }
            });
        // req.body['owner'] = req.user._id;
        // req._ermQueryOptions.query = {
        //     owner: req.user._id
        // };
    } catch(e) {
        res.notFound("Can't be create")
    }
};

module.exports.preRead = async (req,res,next, backendApp) => {
    const Setting = backendApp.mongoose.model('Setting');
    // await isLoggedIn(req,res,backendApp);
    Setting.findOne({})
        .exec((e,r)=>{
            if (e) return res.serverError(e);
            if (!r) return res.badRequest('Not valid setting');
            if (r) return res.ok(r);
        })
    // return [readStep]
};

const isLoggedIn = (req,res,backendApp) => {
    return new Promise((rs,rj)=>{
        backendApp.middlewares.isLoggedIn(req,res, (e=null)=>{rs(e)})
    })
}