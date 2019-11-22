let restFunction = {};
const fs = require('fs');
module.exports = backendApp => {
    // const restify = require('express-restify-mongoose');
    const restify = require('express-restify-mongoose');
    const modelNames = backendApp.mongoose.modelNames();

    modelNames.forEach( modelName => {
        const model = backendApp.mongoose.model(modelName);
        let update_ws = (req, res, next) =>{
            if (!req.body.ws) return next();
            backendApp.events.callWS.emit('message', req.body.ws);
            next()
        };
        const checkFile = (req,res,next) => {
            if (!req.params.id) return next();
            let prop;
            if (req.body.img){
                prop = 'img'
            } else if (req.body.image){
                prop = 'image'
            } else {
                prop = null;
            }
            new Promise((rs,rj)=>{
                model.findOne({_id:req.params.id}).exec((e,r)=>{
                    if (e) return rj(e);
                    if (!r) return rj("Not Found!");
                    if (prop) {
                        if (r[prop] === req.body[prop]){
                            rs('return')
                        } else {
                            rs(r[prop])
                        }
                    } else {
                        let result = r.img || r.image;
                        rs(result)
                    }

                })
            }).then(mainName => {
                if (!mainName || mainName === 'return') return next();
                fs.unlink("upload/"+mainName, fsCallbeack=>{
                    fs.unlink("upload/address/"+mainName, fsCallbeack=>{
                        fs.unlink("upload/avatar/"+mainName, fsCallbeack=>{
                            fs.unlink("upload/product/"+mainName, fsCallbeack=>{
                                next()
                            });
                        });
                    });
                });
            }).catch(e=>{
                res.serverError(e)
            })


        };

        if (model.schema.options.createRestApi) {
            const modelOpt = model.schema.options;
            const router = backendApp.express.Router();
            restify.serve(router, model, {
                prefix: "",
                version: "",
                runValidators: true,
                totalCountHeader: true,
                lean: false,
                findOneAndUpdate: true,
                findOneAndRemove: true,
                postRead: [schemaPre.PostRead],
                // preMiddleware: backendApp.middlewares.isLoggedIn,
                preRead: [
                    // model.schema.options.needBeAdminR ? backendApp.middlewares.isAdmin :  nextS,
                    modelOpt.needLogined ? backendApp.middlewares.isLoggedIn : backendApp.middlewares.checkLoggedIn,
                    modelOpt.needLogined ? isVerify(backendApp) : backendApp.middlewares.checkLoggedIn,
                    // modelOpt.needLogined || modelOpt.client ? canRead(modelOpt) : nextS,
                    modelOpt.needLogined ? canRead(modelOpt) : nextS,
                    // model.schema.options.needAccessControl && !model.schema.options.needLogined && !model.schema.options.needBeAdmin ? backendApp.middlewares.isLoggedIn :  nextS,
                    // model.schema.options.needAccessControl && !model.schema.options.needBeAdmin ? backendApp.middlewares.checkAccessRights(modelName + '.canRead') :  nextS,
                    schemaPre.Read],
                preCreate: [
                    modelOpt.notCreate ? forbidden : nextS,
                    // model.schema.options.needBeAdminCUD ? backendApp.middlewares.isAdmin :  nextS,
                    modelOpt.client &&
                    modelOpt.client.create &&
                    modelOpt.client.create[0] &&
                    modelOpt.client.create[0].public ? backendApp.middlewares.checkLoggedIn : backendApp.middlewares.isLoggedIn,
                    isVerify(backendApp),
                    // model.schema.options.needAccessControl ? backendApp.middlewares.checkAccessRights(modelName + '.canCreate') :  nextS,
                    schemaPre.Save],
                postCreate: [update_ws, schemaPre.PostCreate],
                preUpdate: [
                    // model.schema.options.needBeAdminCUD ? backendApp.middlewares.isAdmin :  nextS,
                    // model.schema.options.needLogined ? backendApp.middlewares.isLoggedIn : nextS,
                    // model.schema.options.needAccessControl ? backendApp.middlewares.checkAccessRights(modelName + '.canUpdate') :  nextS,
                    backendApp.middlewares.isLoggedIn,
                    isVerify(backendApp),
                    canUpdate(modelOpt),
                    checkFile,
                    schemaPre.Update],
                postUpdate: [update_ws, schemaPre.PostUpdate],
                preDelete: [
                    // model.schema.options.needBeAdmin ? backendApp.middlewares.isAdmin :  nextS,
                    // model.schema.options.needLogined && !model.schema.options.needBeAdmin ? backendApp.middlewares.isLoggedIn : nextS,
                    // model.schema.options.needAccessControl && !model.schema.options.needLogined && !model.schema.options.needBeAdmin ? backendApp.middlewares.isLoggedIn :  nextS,
                    // model.schema.options.needAccessControl && !model.schema.options.needBeAdmin ? backendApp.middlewares.checkAccessRights(modelName + '.canDelete') :  nextS,
                    backendApp.middlewares.isLoggedIn,
                    isVerify(backendApp),
                    canUpdate(modelOpt),
                    checkFile,
                    schemaPre.Delete],
                postDelete: [update_ws, schemaPre.PostDelete],
                // preCustomLink: backendApp.middlewares.isLoggedIn
            });
            backendApp.app.use("/api", router);
        }
    });

    const glob = require('glob');
    let schemaMethods = glob.sync(backendApp.config.root+'/model/model_methods/restifyMethod/*.js');
    schemaMethods.forEach((controller) => {
        restFunction[parseFileName(controller).toLowerCase()] = require(controller);
    });


};
const isVerify = backendApp => {
    return (req,res,next)=>{
        if (req.user && req.user.verify) {
            next()
        } else {
            if (req.user && req.user.banned){
                res.forbidden("Profile is banned")
            } else
            if (req.user && !req.user.verify) {
                const signup = new backendApp.hooks.signupRole(req, res, req.user, backendApp);
                signup.init()
            } else if (!req.user) {
                next()
            }
        }
    }
};

const canRead = (options) => {
    return (req,res,next)=>{
        const objPromise = checkOwner(req,res,next,options);
        Promise.all(objPromise).then(query => {
            let opt;
            console.log(req.erm.query)
            query.some(it => {
                if (it) {
                    opt = it;
                    return opt;
                }
            });
            if (!opt) return res.forbidden('403');
            if (Object.entries(req.erm.query).length > 0) {
                req.erm.query['query'] =  {};
                if (typeof opt == 'object' && opt){
                    if (req.query.query){
                        req.erm.query['query'] =  {$and: [opt, JSON.parse(req.query.query)]};
                    }else {
                        req.erm.query['query'] =  {$and: [opt]};
                    }
                } else {
                    if (req.query.query){
                        req.erm.query['query'] =  {$and: [JSON.parse(req.query.query)]};
                    }else {
                        req.erm.query['query'] =  {$and: [{}]};
                    }
                }


            } else {
                req.erm.query['query'] = typeof opt == 'object' ? opt : {};
            }
            if (req.error.success) {
                if (req.erm.query['query'] === true) req.erm.query['query'] = {};
                return next()
            } else {
                res.notFound("No one document")
            }

        }, e=>{console.log(e); res.forbidden(e)});
    }
};
const canUpdate = (options) => {
    return (req,res,next)=>{
        const objPromise = checkOwnerPost(req,res,next,options);
        Promise.all(objPromise).then(query => {
            let opt;
            opt = query.some(it => {
                if (it) return it
            });
            if (opt || req.error.success) {
                return next()
            } else {
                res.notFound("No one document12", opt)
            }

        }).catch(e=>{console.log(e); res.badRequest(e)});
    }
};
const schemaPre = {
    Read: (req, res, next) => callMethod(req, res, next, 'preRead'),
    Save: (req, res, next) => {
        req.body.date = new Date();
        if (req.user) req.body.createdBy = req.user._id;
        callMethod(req, res, next, 'preSave')
    },
    Update: (req, res, next) => {
        req.body.lastUpdate = req.body.lastUpdate ? req.body.lastUpdate : new Date();
        delete req.body.createdBy;
        callMethod(req, res, next, 'preUpdate')
    },
    Delete: (req, res, next) => callMethod(req, res, next, 'preDel'),
    PostUpdate: (req, res, next) => callMethod(req, res, next, 'postUpdate'),
    PostCreate: (req, res, next) => callMethod(req, res, next, 'postCreate'),
    PostDelete: (req, res, next) => callMethod(req, res, next, 'postDelete'),
    PostRead: (req, res, next) => callMethod(req, res, next, 'postRead'),
};

const nextS = (req, res, next) => next();
const forbidden = (req, res, next) => res.forbidden("Not access!");
const callMethod = (req,res,next,method) => {
    let schem = restFunction[String(req.erm.model.modelName.toLowerCase())];
    if (schem && schem[method]) {
        try {
            // res.ok('');
            schem[method](req, res, next, backendApp);
        } catch (e) {
            next()
        }
    } else {
        // console.log("method", method);
        next()
    }
};
const parseFileName = str =>{
    let strRout = str.split('.js')[0];
    return strRout ? strRout.split('restifyMethod/')[1] : ''
};

const checkOwnerPost = (req,res,next,options) => {
    const mongoose = require('mongoose');
    const model = req.erm.model.modelName;
    const role = req.user ? req.user.role || 'client' : 'client';
    let objPromise = [];
    req.error = {success: false};
    let query = {$or: [{'createdBy.itemId': req.user._id},
            {createdBy: req.user._id},
            {_id: req.user._id}]};

    objPromise.push( new Promise((rs,rj)=> {
        if (!options[role] || !options[role].update) {
            rs(false);
        }
        if (options[role].update[0].public || role === 'sa'){
            req.error.success = true;
            rs(true);
        }
        if (options[role].update[0].private) {
            if (Object.entries(req.erm.query).length > 0) {
                req.erm.query['query'] = {};
                if (req.query.query) {
                    req.erm.query['query'] = {$and: [query, JSON.parse(req.query.query)]};
                } else {
                    req.erm.query['query'] = {$and: [query]};
                }
            } else {
                req.erm.query['query'] = query;
            }
            if (!req.erm.query.query) { return rs(false); }
            mongoose.model(model).findOne(req.erm.query.query).exec((e,r)=>{
                if (e) return rj(e);
                if (!r) return rs(false);
                if (r) {
                    req.error.success = true;
                    return rs(true)
                }
            })
        }
    }));
    if (!options[role].update || (options[role].update[0].public || role === 'sa') || options[role].update[0].private){
        return objPromise
    } else {
        objPromise = [];
        options[role].update.forEach( it =>{
            if (it.model) {
                if (req.params.id) {
                    objPromise.push( new Promise((rs,rj)=>{
                        backendApp.mongoose.model(model)
                            .findOne({_id: req.params.id})
                            .exec((e, r) => {
                                if (e) return rj(e);
                                if (!r) return rs(false);
                                const checkId = r[it._id] ? r[it._id].toString() : null;
                                it.canBeId.forEach(idChecker => {
                                    if (idChecker.fieldName == '_id') {
                                        if (checkId == req.user._id){
                                            rs(true)
                                        }
                                    }
                                    if (idChecker.type === 'refObj') {
                                        let obj = {};
                                        if (idChecker.fieldName != '_id' && !req.error.success) {
                                            obj['_id'] = checkId || req.params.id.toString();
                                            obj[idChecker.fieldName] = req.user._id.toString();
                                            backendApp.mongoose.model(it.model)
                                                .findOne(obj).exec((e1, r1) => {
                                                if (e1) rj(e1);
                                                if (!r1) {
                                                    rs(false)
                                                } else {
                                                    req.error.success = true;
                                                    rs(true)
                                                }
                                            })
                                        } else {
                                            rs(false)
                                        }

                                    }
                                    if (idChecker.type === 'array') {
                                        let obj = {};
                                        obj['_id'] = checkId || req.params.id.toString();
                                        obj[idChecker.fieldName] = {$in:req.user._id.toString()};
                                        backendApp.mongoose.model(it.model)
                                            .findOne(obj).exec((e1, r1) => {
                                            if (e1) rj(e1);
                                            if (!r1) {
                                                rs(false)
                                            }else{
                                                req.error.success = true;
                                                rs(true)
                                            }
                                        })
                                    }
                                })
                            })
                    }))
                }
            }
        });
        return objPromise
    }

}
const checkOwner = (req,res,next,options) => {
    const model = req.erm.model.modelName;
    const role = req.user ? req.user.role || 'client' : 'client';
    let objPromise = [];
    req.error = {success: false};
    let query = {$or: [{'createdBy.itemId': req.user._id},
            {createdBy: req.user._id},
            {_id: req.user._id}]};
    console.log("options[role].read[0]",options[role].read[0])
    if (!options[role] || !options[role].read) {
        objPromise.push( new Promise((rs,rj)=> {rj("Not access!")}))
        return objPromise
    } else
    if ((options[role].read[0].public || role === 'sa') || options[role].read[0].private){

        objPromise.push( new Promise((rs,rj)=> {

            if (options[role].read[0].public){
                req.error.success = true;
                // if(role === 'sa'){
                //     rs(true);
                // } else {
                //     rs(query)
                // }
                rs(true);

                // return objPromise
            }
            if (options[role].read[0].private) {
                if (Object.entries(req.erm.query).length > 0) {
                    req.erm.query['query'] = {};
                    if (req.query.query) {
                        req.erm.query['query'] = {$and: [query, JSON.parse(req.query.query)]};
                    } else {
                        req.erm.query['query'] = {$and: [query]};
                    }
                } else {
                    req.erm.query['query'] = query;
                }
                req.error.success = true;
                console.log("Private", query)
                rs(query);
                // return objPromise
            }
        }));
        return objPromise
    } else
    {
        objPromise = [];
        options[role].read.forEach( it =>{
            if (it.model) {
                // if params.id
                if (req.params.id) {
                    objPromise.push( new Promise((rs,rj)=>{
                        backendApp.mongoose.model(model)
                            .findOne({_id: req.params.id})
                            .exec((e, r) => {
                                if (e) return rj(e);
                                if (!r) return rs(false);
                                const checkId = r[it._id] ? r[it._id].toString() : null;
                                it.canBeId.forEach(idChecker => {
                                    if (idChecker.fieldName == '_id') {
                                        if (checkId == req.user._id) {
                                            req.error.success = true;
                                            rs(query)
                                        }
                                    }

                                    if (idChecker.type === 'refObj') {
                                        let obj = {};
                                        obj['_id'] = checkId || req.params.id.toString();
                                        obj[idChecker.fieldName] = req.user._id.toString();
                                        backendApp.mongoose.model(it.model)
                                            .findOne(obj).exec((e1, r1) => {
                                            if (e1) rj(e1);
                                            if (!r1) {
                                                rs(false)
                                            } else {
                                                let _o = {};
                                                _o[it ? it._id || '_id' : '_id'] = r1._id;
                                                query['$or'].push(_o);
                                                req.error.success = true;
                                                rs(query)
                                            }
                                        })
                                    }
                                    if (idChecker.type === 'array') {
                                        let obj = {};
                                        obj['_id'] = checkId || req.params.id.toString();
                                        obj[idChecker.fieldName] = {$in:req.user._id.toString()};
                                        backendApp.mongoose.model(it.model)
                                            .findOne(obj).exec((e1, r1) => {
                                            if (e1) rj();
                                            if (!r1) {
                                                rs(false)
                                            }else{
                                                let _o = {};
                                                _o[it ? it._id || '_id' : '_id'] = r1._id;
                                                query['$or'].push(_o);
                                                req.error.success = true;
                                                rs(query)
                                            }
                                        })
                                    }
                                })
                            })
                    }))
                }
                if (!req.params.id) {
                    it.canBeId.forEach(idChecker => {
                        objPromise.push( new Promise((rs,rj)=>{
                            if (idChecker.type === 'refObj') {

                                let obj = {};
                                obj[idChecker.fieldName] = req.user._id.toString();

                                // console.log(it.model,obj)
                                backendApp.mongoose.model(it.model)
                                    .findOne(obj).exec((e1, r1) => {
                                    if (e1) rj(e1);
                                    if (!r1) {
                                        // check another field
                                        // res.forbidden("403 1")
                                        rs(false)
                                    } else {
                                        let _o = {};
                                        _o[it._id || '_id'] = r1._id;
                                        query['$or'].push(_o);
                                        req.error.success = true;
                                        rs(query)
                                    }
                                })
                            }
                            if (idChecker.type === 'array') {
                                let obj = {};
                                obj[idChecker.fieldName] = {$in:req.user._id.toString()};
                                backendApp.mongoose.model(it.model)
                                    .findOne(obj).exec((e1, r1) => {
                                    if (e1) rj() ;
                                    if (!r1) {
                                        rs(false)
                                    } else {
                                        let _o = {};
                                        _o[it._id || '_id'] = r1._id;
                                        query['$or'].push(_o);
                                        req.error.success = true;
                                        rs(query)
                                    }
                                })
                            }
                        }))
                    });
                }
            }
        });
        return objPromise
    }
};
