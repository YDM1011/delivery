let restFunction = {};
module.exports = backendApp => {
    // const restify = require('express-restify-mongoose');
    const restify = require('express-restify-mongoose');
    const modelNames = backendApp.mongoose.modelNames();

    modelNames.forEach( modelName => {
        console.log(modelName);
        const model = backendApp.mongoose.model(modelName);
        let update_ws = (req, res, next) =>{
            // if (!req.body.ws) return next();
            backendApp.events.callWS.emit('message', req.body.ws);
            next()
        };

        if (model.schema.options.createRestApi) {
            const router = backendApp.express.Router();
            restify.serve(router, model, {
                prefix: "",
                version: "",
                runValidators: true,
                totalCountHeader: true,
                lean: false,
                findOneAndUpdate: true,
                findOneAndRemove: true,
                postRead: [update_ws, schemaPre.PostRead],
                // preMiddleware: backendApp.middlewares.isLoggedIn,
                preRead: [
                    // model.schema.options.needBeAdminR ? backendApp.middlewares.isAdmin :  nextS,
                    model.schema.options.needLogined ? backendApp.middlewares.isLoggedIn : nextS,
                    backendApp.middlewares.isLoggedIn, canRead(model.schema.options),
                    // model.schema.options.needAccessControl && !model.schema.options.needLogined && !model.schema.options.needBeAdmin ? backendApp.middlewares.isLoggedIn :  nextS,
                    // model.schema.options.needAccessControl && !model.schema.options.needBeAdmin ? backendApp.middlewares.checkAccessRights(modelName + '.canRead') :  nextS,
                    schemaPre.Read],
                preCreate: [
                    // model.schema.options.needBeAdminCUD ? backendApp.middlewares.isAdmin :  nextS,
                    model.schema.options.needLogined ? backendApp.middlewares.isLoggedIn : nextS,
                    // model.schema.options.needAccessControl ? backendApp.middlewares.checkAccessRights(modelName + '.canCreate') :  nextS,
                    schemaPre.Save],
                postCreate: [update_ws, schemaPre.PostCreate],
                preUpdate: [
                    // model.schema.options.needBeAdminCUD ? backendApp.middlewares.isAdmin :  nextS,
                    // model.schema.options.needLogined ? backendApp.middlewares.isLoggedIn : nextS,
                    // model.schema.options.needAccessControl ? backendApp.middlewares.checkAccessRights(modelName + '.canUpdate') :  nextS,
                    schemaPre.Update],
                postUpdate: [update_ws, schemaPre.PostUpdate],
                preDelete: [
                    model.schema.options.needBeAdmin ? backendApp.middlewares.isAdmin :  nextS,
                    model.schema.options.needLogined && !model.schema.options.needBeAdmin ? backendApp.middlewares.isLoggedIn : nextS,
                    model.schema.options.needAccessControl && !model.schema.options.needLogined && !model.schema.options.needBeAdmin ? backendApp.middlewares.isLoggedIn :  nextS,
                    model.schema.options.needAccessControl && !model.schema.options.needBeAdmin ? backendApp.middlewares.checkAccessRights(modelName + '.canDelete') :  nextS,
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

const canRead = (options) => {
    return (req,res,next) => {
        const model = req.erm.model.modelName;
        console.log(req.user.role)
        // next()
        if (req.user.role == 'client' || !req.user.role) {
            switch (options[req.user.role || 'client']) {
                case 'byId':
                    console.log("OK!!!", req.params)
                    if (req.params.id) {

                    } else {
                        // model.findOne({
                        //     _id:id,
                        //     createdBy: req.user._id
                        // }).exec((err,r)=>{
                        //     if (err) return res.serverError(err);
                        //     if (!r) return res.forbidden("Forbidden");
                        //     if (r) return next();3
                        // })
                        console.log("OK!!!1", req.erm.query)
                        // req.erm.query =  { _id: '5d0b7b0c254a8d1ee0580d90' } };
                        req.erm.query = { query: {$or: [{'createdBy.itemId': req.user._id},
                                    {createdBy: req.user._id},
                                    {_id: req.user._id}]} };
                        // req.erm.query = { query: '{"_id":"5d0b7b0c254a8d1ee0580d90"}' };
                        console.log("OK!!!2", req.erm.query.query);
                        next()
                    }
                    break;
                default: next()
            }
        }
    };
};
const schemaPre = {
    Read: (req, res, next) => callMethod(req, res, next, 'preRead'),
    Save: (req, res, next) => {
        req.body.date = req.body.date ? req.body.date : new Date();
        req.body.createdBy = req.user._id;
        callMethod(req, res, next, 'preSave')
    },
    Update: (req, res, next) => {
        req.body.lastUpdate = req.body.lastUpdate ? req.body.lastUpdate : new Date();
        callMethod(req, res, next, 'preUpdate')
    },
    Delete: (req, res, next) => callMethod(req, res, next, 'preDel'),
    PostUpdate: (req, res, next) => callMethod(req, res, next, 'postUpdate'),
    PostCreate: (req, res, next) => callMethod(req, res, next, 'postCreate'),
    PostDelete: (req, res, next) => callMethod(req, res, next, 'postDelete'),
    PostRead: (req, res, next) => callMethod(req, res, next, 'postRead'),
};

const nextS = (req, res, next) => next();


const callMethod = (req,res,next,method) => {
    let schem = restFunction[String(req.erm.model.modelName.toLowerCase())];
    // return res.o("ok")
    console.log(method)
    if (schem && schem[method]) {
        try {
            // res.ok('');
            schem[method](req, res, next, backendApp);
        } catch (e) {
            // res.ok('');
            console.log(method)
            next()
        }
    } else {
        console.log("method", method)
        next()
    }
};


const parseFileName = str =>{
    // return str.match(/\/?([^:\/\s]+)((\/\w+)*\/)([a-zA-Z]\w+)?/i)[4]
    let strRout = str.split('.js')[0];
    return strRout ? strRout.split('restifyMethod/')[1] : ''
};
