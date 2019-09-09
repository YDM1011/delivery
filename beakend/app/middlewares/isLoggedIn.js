const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const Admin = mongoose.model('Admin');
const config = require('../config/config');

module.exports = (req, res, next) => {
  if (req.jwt) {
      const jwt = require('jsonwebtoken');
      const protect = req.cookies['token'] || req.jwt.token || req.headers.authorization;
      console.log(protect)
      if(!protect) return tryAsAdmin(req, res, next);

      const connect = protect.split(" ");
      console.log(connect)
      jwt.verify(connect[0], config.jwtSecret, (err,data)=>{
          if (err) return res.serverError("Token error");

          Client.findOne({login: data.login })
              .exec((err, info)=>{
                  if (err) return next(err);
                  if (!info) return tryAsAdmin(req, res, next)

                  req.user = info.toObject();
                  bodyModyfi(req);
                  tryAsAdmin(req, res, next);
              });
      });
  } else {
    res.status(401).send("Login is required");
  }
};

const tryAsAdmin = (req,res,next) => {
    const jwt = require('jsonwebtoken');
    const protect = req.cookies['adminToken'] || req.jwt.token || req.headers.authorization;
    if(!protect && !req.user){
        return res.forbidden("forbidden121");
    }
    const connect = protect.split(" ");
    jwt.verify(connect[0], config.jwtSecret, (err,data)=>{
        if (err) {
            if (!req.user) return res.serverError("Token error");
            return next()
        }else{
            Admin.findOne({login: data.login })
                .exec((err, infoA)=>{
                    if (err) return next(err);
                    if (!infoA){
                        if (!req.user) return res.forbidden("forbidden3");
                        return next()
                    }
                    if (req.user) return next();
                    req.user = infoA.toObject();
                    bodyModyfi(req);
                    next()
                });
        }
    });
};

const bodyModyfi = (req) => {
  req.body['createdBy'] = {
      itemId: req.user._id
  };
  return req.body
};