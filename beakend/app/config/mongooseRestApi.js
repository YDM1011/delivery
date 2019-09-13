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
        const canRead = (options) => {
            return (req,res,next) => {
                const model = req.erm.model.modelName;
                console.log(options)
                next()
                // if (req.user.role == 'client') {
                //
                // }
            };
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
                    canRead(model.schema.options),
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
