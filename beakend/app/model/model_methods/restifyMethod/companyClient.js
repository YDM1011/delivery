module.exports.preUpdate = async (req,res,next, backendApp) => {
    const Client = backendApp.mongoose.model('Client');
    const companyClient = backendApp.mongoose.model('companyClient');

    companyClient
        .findOne({_id:req.params.id}).exec((e,r)=>{
        if (r) {
            Client
                .findOne({_id:r.clientOwner})
                .select('name mobile login')
                .exec((e,r)=>{
                    if (r) {
                        req.body['name'] = r.name;
                        req.body['mobile'] = r.mobile;
                        req.body['login'] = r.login;
                        next()
                    } else { next() }
                })
        } else { next() }
    })
};