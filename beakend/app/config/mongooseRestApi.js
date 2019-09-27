let restFunction = {};
module.exports = backendApp => {
    // const restify = require('express-restify-mongoose');
    const restify = require('express-restify-mongoose');
    const modelNames = backendApp.mongoose.modelNames();

    modelNames.forEach( modelName => {
        console.log(modelName);
        const model = backendApp.mongoose.model(modelName);
        let update_ws = (req, res, next) =>{
            if (!req.body.ws) return next();
            backendApp.events.callWS.emit('message', req.body.ws);
            next()
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
                // postRead: [update_ws, schemaPre.PostRead],
                // preMiddleware: backendApp.middlewares.isLoggedIn,
                preRead: [
                    // model.schema.options.needBeAdminR ? backendApp.middlewares.isAdmin :  nextS,
                    modelOpt.needLogined || modelOpt.client ? backendApp.middlewares.isLoggedIn : backendApp.middlewares.checkLoggedIn,
                    // modelOpt.needLogined || modelOpt.client ? canRead(modelOpt) : nextS,
                    canRead(modelOpt),
                    // model.schema.options.needAccessControl && !model.schema.options.needLogined && !model.schema.options.needBeAdmin ? backendApp.middlewares.isLoggedIn :  nextS,
                    // model.schema.options.needAccessControl && !model.schema.options.needBeAdmin ? backendApp.middlewares.checkAccessRights(modelName + '.canRead') :  nextS,
                    schemaPre.Read],
                preCreate: [
                    modelOpt.notCreate ? forbidden : nextS,
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
                    // model.schema.options.needBeAdmin ? backendApp.middlewares.isAdmin :  nextS,
                    // model.schema.options.needLogined && !model.schema.options.needBeAdmin ? backendApp.middlewares.isLoggedIn : nextS,
                    // model.schema.options.needAccessControl && !model.schema.options.needLogined && !model.schema.options.needBeAdmin ? backendApp.middlewares.isLoggedIn :  nextS,
                    // model.schema.options.needAccessControl && !model.schema.options.needBeAdmin ? backendApp.middlewares.checkAccessRights(modelName + '.canDelete') :  nextS,
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
      const role = req.user ? req.user.role || 'client' : 'client';
      let objPromise = [];
      let error = {success: false};
      let query = {$or: [{'createdBy.itemId': req.user._id},
              {createdBy: req.user._id},
              {_id: req.user._id}]};
      if (!options[role]) {
          return res.forbidden("Permission is undefined")
      }
      if (options[role][0].private) {
          if (Object.entries(req.query).length > 0) {
              console.log(JSON.parse(req.query.query));
              req.erm.query = { query: {$and: [query, JSON.parse(req.query.query)]} };
          } else {
              req.erm.query = { query: query };
          }
          return next()
      }
      if (options[role][0].public) {
          if (Object.entries(req.query).length > 0) {
              console.log(JSON.parse(req.query.query));
              req.erm.query = { query: JSON.parse(req.query.query) };
          }
          return next()
      }
      options[role].forEach( it =>{
          console.log(it)
          if (it.model) {
              // if params.id
              if (req.params.id) {
                  objPromise.push( new Promise((rs,rj)=>{
                  backendApp.mongoose.model(model)
                      .findOne({_id: req.params.id})
                      .exec((e, r) => {
                          if (e) return res.serverError(e);
                          if (!r) return res.forbidden('Not access!');
                          const checkId = r[it._id] ? r[it._id].toString() : null;
                          it.canBeId.forEach(idChecker => {
                              // console.log("idChecker:",it.model,idChecker);
                              if (idChecker.fieldName == '_id') {
                                  if (checkId == req.user._id){
                                      rs()
                                  } else {
                                      rj("403")
                                  }
                              }
                              if (idChecker.type === 'refObj') {

                                  let obj = {};
                                  obj['_id'] = checkId || req.params.id.toString();
                                  obj[idChecker.fieldName] = req.user._id.toString();

                                  // console.log(it.model,obj)
                                  backendApp.mongoose.model(it.model)
                                      .findOne(obj).exec((e1, r1) => {
                                      console.log(it.model,obj)
                                          console.log(e1,r1);
                                      if (e1) rj();
                                      if (!r1) {
                                          // check another field
                                          // res.forbidden("403 1")
                                          rs()
                                      }else{
                                          let _o = {};
                                          _o[it ? it._id || '_id' : '_id'] = r1._id;
                                          query['$or'].push(_o);
                                          rs()
                                      }
                                  })
                              }
                              if (idChecker.type === 'array') {
                                  let obj = {};
                                  obj['_id'] = checkId || req.params.id.toString();
                                  obj[idChecker.fieldName] = {$in:req.user._id.toString()};
                                  // console.log(it.model,obj)
                                  backendApp.mongoose.model(it.model)
                                      .findOne(obj).exec((e1, r1) => {
                                      console.log(it.model,obj)
                                      console.log(e1,r1);
                                      if (e1) rj();
                                      if (!r1) {
                                          // check another field
                                          // res.forbidden("403 1")
                                          rs()
                                      }else{
                                          let _o = {};
                                          _o[it ? it._id || '_id' : '_id'] = r1._id;
                                          query['$or'].push(_o);
                                          rs()
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
                                  if (e1) rj();
                                  if (!r1) {
                                      // check another field
                                      // res.forbidden("403 1")
                                      rs("Not found0")
                                  } else {
                                      console.log("r00",it._id)
                                      let _o = {};
                                      _o[it._id || '_id'] = r1._id;
                                      query['$or'].push(_o);
                                      console.log("t00",query['$or'],_o)
                                      error.success = true;
                                      rs()
                                  }
                              })
                          }
                          if (idChecker.type === 'array') {
                              let obj = {};
                              obj[idChecker.fieldName] = {$in:req.user._id.toString()};
                              console.log(it.model,obj)
                              backendApp.mongoose.model(it.model)
                                  .findOne(obj).exec((e1, r1) => {
                                  if (e1) rj() ;
                                  if (!r1) {
                                      rs("Not found1")
                                  } else {
                                      console.log("r00",it._id)
                                      let _o = {};
                                      _o[it._id || '_id'] = r1._id;
                                      query['$or'].push(_o);
                                      console.log("t00",query['$or'],_o)
                                      error.success = true;
                                      rs()
                                  }
                              })
                          }
                      }))
                  });
              }
          }

      });
      Promise.all(objPromise).then(v => {
          if (Object.entries(req.query).length > 0) {
              console.log(JSON.parse(req.query.query));
              req.erm.query = { query: {$and: [query, JSON.parse(req.query.query)]} };
          } else {
              req.erm.query = { query: query };
          }
          if (error.success) {
              return next()
          } else {
              res.notFound("No one document")
          }

      }).catch(e=>{res.badRequest(e)});

  }
};
const schemaPre = {
    Read: (req, res, next) => callMethod(req, res, next, 'preRead'),
    Save: (req, res, next) => {
        req.body.date = req.body.date ? req.body.date : new Date();
        if (req.user) req.body.createdBy = req.user._id;
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
const forbidden = (req, res, next) => res.forbidden("Not access!");

const callMethod = (req,res,next,method) => {
    let schem = restFunction[String(req.erm.model.modelName.toLowerCase())];
    if (schem && schem[method]) {
        try {
            // res.ok('');
            schem[method](req, res, next, backendApp);
        } catch (e) {
            // res.ok('');
            console.log(method, e);
            next()
        }
    } else {
        console.log("method", method);
        next()
    }
};


const parseFileName = str =>{
    // return str.match(/\/?([^:\/\s]+)((\/\w+)*\/)([a-zA-Z]\w+)?/i)[4]
    let strRout = str.split('.js')[0];
    return strRout ? strRout.split('restifyMethod/')[1] : ''
};
