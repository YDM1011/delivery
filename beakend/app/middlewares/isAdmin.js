const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const Admin = mongoose.model('Admin');
const config = require('../config/config');

module.exports = (req, res, next) => {
    if (req.jwt) {
        const jwt = require('jsonwebtoken');
        const protect = req.cookies['adminToken'] || req.jwt.token || req.headers.authorization;
        if(!protect && !req.user){
            return res.forbidden("forbidden12");
        }
        const connect = protect.split(" ");
        jwt.verify(connect[0], config.jwtSecret, (err,data)=>{
            if (err) {
                if (!req.user) return res.serverError("Token error");
                return next()
            }else{
                Admin.findOne({login: data.login })
                    .exec((err, infoA)=>{
                        if (err) return res.serverError(err);
                        if (!infoA){
                            if (!req.user) return res.forbidden("forbidden3");
                            return next()
                        }
                        req.user = infoA.toObject();
                        next()
                    });
            }
        });
    } else {
        res.status(401).send("Login is required");
    }
};

// const tryAsAdmin = (req,res,next) => {
//     const jwt = require('jsonwebtoken');
//     const protect = req.cookies['adminToken'] || req.jwt.token || req.headers.authorization;
//     if(!protect && !req.user){
//         return res.forbidden("forbidden12");
//     }
//     const connect = protect.split(" ");
//     jwt.verify(connect[0], config.jwtSecret, (err,data)=>{
//         if (err) {
//             if (!req.user) return res.serverError("Token error");
//             return next()
//         }else{
//             Admin.findOne({login: data.login })
//                 .exec((err, infoA)=>{
//                     if (err) return res.serverError(err);
//                     if (!infoA){
//                         if (!req.user) return res.forbidden("forbidden3");
//                         return next()
//                     }
//                     req.user = infoA.toObject();
//                     next()
//                 });
//         }
//     });
// };