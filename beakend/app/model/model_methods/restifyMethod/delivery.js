module.exports.preRead = async (req,res,next, backendApp) => {
    next()
};

module.exports.preUpdate = async (req,res,next, backendApp) => {
    if (typeof req.body.manager == 'object') {
        let manager = null,
            log = null;
        if (req.body.manager.role === 'superManagerDelivery') {
            manager = await createSManeger(req, backendApp).catch(e=>{return res.notFound(e)});
            if (!manager) return res.badRequest('Bad request!');
            req.body = {superManager: manager._id};
            next()
        }
        if (req.body.manager.role === 'managerDelivery') {
            manager = await createManeger(req, backendApp).catch(e=>{return res.notFound(e)});
            console.log(manager, req.body);
            log = await actionLogCreate(manager._id,backendApp).catch(e=>{return res.notFound(e)});;
            if (!manager || !log) return res.badRequest('Bad request!');
            // let model = req.body.manager.role === 'managerCleaner' ? 'Cleaner' : 'Delivery';
            req.body = {$push:{managers: manager._id}};
            backendApp.mongoose.model('Delivery')
                .findOneAndUpdate({_id:req.params.id}, req.body, {new:true})
                .exec((e,r)=>{
                    if(e) return res.serverError(e);
                    if(!r) return res.badRequest();
                    if(r) {
                        backendApp.mongoose.model('Client')
                            .findOneAndUpdate({_id:manager._id}, {loger:log._id}, {new:true})
                            .exec((e1,r1)=>{
                                if(e1) return res.serverError(e1);
                                if(!r1) return res.badRequest();
                                if(r1) return res.ok(r1);
                            });
                        // let data = model === 'Cleaner' ? : {delivery:r._id}
                        backendApp.mongoose.model('ActionLog')
                            .findOneAndUpdate({owner:manager._id}, {delivery:r._id}, {new:true})
                            .exec((e2,r2)=>{})
                    }
                });
        }
    } else {
        next()
    }
};
const actionLogCreate = (managerId,backendApp) => {
    return new Promise((rs,rj)=>{
        backendApp.mongoose.model('ActionLog')
            .create({owner:managerId}, (err,r)=>{
                if(err) return rj(err);
                if(r) return rs(r);
                if(!r) return rs(null);
            })
    })
};
const createSManeger = (req, backendApp) => {
    return new Promise((rs,rj)=>{
        delete req.body.manager.token;
        req.body.manager['token'] = getToken(backendApp,req.body.manager.login);
        backendApp.mongoose.model('Client')
            .create(req.body.manager, (err,r)=>{
                if(err) return rj(err);
                rs(r);
            })
    })
};
const createManeger = (req, backendApp) => {
    return new Promise((rs,rj)=>{
        delete req.body.manager.token;
        req.body.manager['token'] = getToken(backendApp,req.body.manager.login);
        backendApp.mongoose.model('Client')
            .create(req.body.manager, (err,r)=>{
                if(err) return rj(err);
                rs(r);
            })
    })
};
const getToken = (backendApp,login) =>{
    const jwt = require('jsonwebtoken');
    return jwt.sign({login: login}, backendApp.config.jwtSecret);
};
