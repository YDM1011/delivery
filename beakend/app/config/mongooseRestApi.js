let restFunction = {};
module.exports = backendApp => {
    // const restify = require('express-restify-mongoose');
    const restify = require('express-restify-mongoose');
    const modelNames = backendApp.mongoose.modelNames();
    modelNames.forEach( modelName => {
        const model = backendApp.mongoose.model(modelName);
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
                postRead: schemaPre.PostRead,
                // preMiddleware: backendApp.middlewares.isLoggedIn,
                preRead: [
                    model.schema.options.needBeAdminR ? backendApp.middlewares.isAdmin :  nextS,
                    model.schema.options.needLogined ? backendApp.middlewares.isLoggedIn : nextS,
                    model.schema.options.needOwnerPermission ? backendApp.middlewares.isOwnerPermission : nextS,
                    model.schema.options.needAccessControl ? backendApp.middlewares.checkAccessRights(modelName + '.read') :  nextS,
                    schemaPre.Read],
                preCreate: [
                    model.schema.options.needBeAdminCUD ? backendApp.middlewares.isAdmin :  nextS,
                    model.schema.options.needLogined ? backendApp.middlewares.isLoggedIn : nextS,
                    model.schema.options.needAccessControl ? backendApp.middlewares.checkAccessRights(modelName + '.create') :  nextS,
                    schemaPre.Save],
                preUpdate: [
                    model.schema.options.needBeAdminCUD ? backendApp.middlewares.isAdmin :  nextS,
                    model.schema.options.needLogined ? backendApp.middlewares.isLoggedIn : nextS,
                    model.schema.options.needAccessControl ? backendApp.middlewares.checkAccessRights(modelName + '.update') :  nextS,
                    schemaPre.Update],
                postUpdate: schemaPre.PostUpdate,
                preDelete: [
                    model.schema.options.needBeAdminCUD ? backendApp.middlewares.isAdmin :  nextS,
                    model.schema.options.needLogined ? backendApp.middlewares.isLoggedIn : nextS,
                    model.schema.options.needAccessControl ? backendApp.middlewares.checkAccessRights(modelName + '.delete') :  nextS,
                    schemaPre.Delete],
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
        callMethod(req, res, next, 'preSave')
    },
    Update: (req, res, next) => {
        req.body.lastUpdate = req.body.lastUpdate ? req.body.lastUpdate : new Date();
        callMethod(req, res, next, 'preUpdate')
    },
    Delete: (req, res, next) => callMethod(req, res, next, 'PreDel'),
    PostUpdate: (req, res, next) => callMethod(req, res, next, 'postUpdate'),
    PostRead: (req, res, next) => callMethod(req, res, next, 'postRead'),
};

const nextS = (req, res, next) => next();


const callMethod = (req,res,next,method) => {
    let schem = restFunction[String(req.erm.model.modelName.toLowerCase())];
    if (schem) {
        try {
            schem[method](req, res, next, backendApp);
        } catch (e) {
            next()
        }
    } else {
        next()
    }
};


const parseFileName = str =>{
    // return str.match(/\/?([^:\/\s]+)((\/\w+)*\/)([a-zA-Z]\w+)?/i)[4]
    let strRout = str.split('.js')[0];
    return strRout ? strRout.split('restifyMethod/')[1] : ''
};
