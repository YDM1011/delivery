// const moduleSpecs = require(__dirname + "/../../config/modulesSpecs.json");
let obj = {
    client: {
        canRead: ['order', 'category', 'city', 'translate', 'brand', 'basket', 'product', 'company'],
        canCreate: ['product', 'basket'],
        canUpdate: ['product', 'basket', 'client'],
        canDelete: ['product', 'basket']
    },
};

module.exports = (permission, allowFunction) => {

  const checkPerm = (req, res, next) => {
      const permissionParts = permission.split(".");
      if (permissionParts.length !== 2) {
          res.serverError("Permission has wrong format: " + permission);
      }

      return new Promise((rs,rj)=>{
          rs(obj.find((el) => {

              // console.log("zc",el[permissionParts[1]])
              return el.clientOwner == req.user._id &&
                  (el.model ? el.model.name == permissionParts[0].toLowerCase() : false) &&
                  el.model[permissionParts[1]]
          }))
      })
  };

  return async (req, res, next) => {
    const permissionParts = permission.split(".");
    if (permissionParts.length !== 2) {
      res.serverError("Permission has wrong format: " + permission);
    }

    // console.log(obj.find((el) => {
    //   return el.clientOwner == req.user._id &&
    //       el.model == permissionParts[0].toLowerCase() &&
    //       el[permissionParts[1]]
    // }));

    const isValid = await checkPerm(req, res, next);
    if (isValid) return next()

    res.forbidden('Access denided')

  };

  //User.read
  // var permissionParts = permission.split(".");
  //
  // if (permissionParts.length !== 2) {
  //   throw new Error("Permission has wrong format: " + permission);
  // }
  //
  // var module = permissionParts[0].toLowerCase();
  // var action = permissionParts[1].toLowerCase();
  //
  // var accessError = "error.i18n.Access denied!";
  //
  // var accessDenied = function (req, res, next) {
  //
  //   var language = req.acceptLanguage;
  //
  //   backendApp.services.TranslateService.translate(accessError, language, function (err, t) {
  //     if (err) return next(err);
  //     res.status(403).send({
  //       status: "ACCESS_DENIED",
  //       message: t
  //     });
  //   })
  //
  // };
  //
  // return function (req, res, next) {
  //
  //   if (req.portalUser) {
  //     /** allow access for portal user to default components */
  //     if (action == 'read' && ['setting', 'contact'].indexOf(module) > -1 ) {
  //       return next();
  //     }
  //     if (action == 'update' && (req.params.id == req.portalUser.id) && ['contact'].indexOf(module) > -1 ) {
  //       return next();
  //     }
  //     /** check permissions for sub modules */
  //     switch (module) {
  //       case 'streamactivity':
  //         module = 'ticket';
  //         break;
  //       case 'ticketcategory':
  //         module = 'ticket';
  //         break;
  //       case 'post':
  //         module = 'news';
  //         break;
  //       default:
  //         break;
  //     }
  //
  //     var Settings = backendApp.mongoose.model("Setting");
  //     Settings.findOne({name: 'portalAccess'}).exec(function (err, access) {
  //       if (err) return accessDenied(req, res, next);
  //       if (access) {
  //         access = access.toObject();
  //         if (access.data[module] && access.data[module].allowed === 'all') {
  //           return next();
  //         }
  //         /**
  //          * Filter by contact status
  //          */
  //         else if (access.data[module] && access.data[module].allowed === 'status') {
  //           if (access.data[module].statusFilter.indexOf(req.portalUser.status) > -1) {
  //             return next();
  //           } else {
  //             return accessDenied(req, res, next);
  //           }
  //         }
  //         /**
  //          * check access by contract type of portal user
  //          */
  //         else if (access.data[module] && access.data[module].allowed === 'type') {
  //           var Contract = backendApp.mongoose.model("Contract");
  //           var ObjectID = require("mongodb").ObjectID;
  //           Contract.find({'linkedContact.itemId': new ObjectID(req.portalUser._id), 'type.itemId': {$exists: true}}).exec(function (err, contracts) {
  //             if (contracts) {
  //               var allowed = contracts.some(function (c) {
  //                 var co = c.toObject();
  //                 return access.data[module].typeFilter.some(function (id) {
  //                   return id == co.type.itemId
  //                 });
  //               });
  //               return allowed ? next() : accessDenied(req, res, next);
  //             } else {
  //               return accessDenied(req, res, next);
  //             }
  //           });
  //         } else {
  //           return accessDenied(req, res, next);
  //         }
  //       } else {
  //         return accessDenied(req, res, next);
  //       }
  //     });
  //   } else {
  //
  //     var user = req.user || null;
  //     if (!user) {
  //       return accessDenied(req, res, next);
  //     }
  //
  //     if (user.isAdmin) {
  //       return next();
  //     }
  //
  //     if (typeof allowFunction === "function") {
  //       if (allowFunction(req, res, next)) {
  //         return next();
  //       }
  //     }
  //
  //     if (!user.role || !user.role.access) {
  //       return accessDenied(req, res, next);
  //     }
  //
  //     if (typeof moduleSpecs[permissionParts[0]] === "undefined") {
  //       console.log("Module " + permissionParts[0] + " is not defined in moduleSpecs file");
  //       return next();
  //     }
  //
  //     if (user.role.access[module] && user.role.access[module].enabled && user.role.access[module][action] && (user.role.access[module][action] === true || user.role.access[module][action] === "all" || user.role.access[module][action] === "own")) {
  //       req.actionAccessPermision = user.role.access[module][action];
  //       next();
  //     } else {
  //       return accessDenied(req, res, next);
  //     }
  //   }
  // };

};
