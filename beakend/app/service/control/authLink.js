const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');

module.exports.parseHash = (str, obj, req) => {
    const jwt = require('jsonwebtoken');
    const protect = str;
    return new Promise((rs,rj)=>{
        if(!protect) return 'false';
        jwt.verify(protect, config.jwtSecret, (err,data)=>{
            if (err) return rs(false);
            for (key in obj) {
                obj[key] = data[key]
            }
            console.log(obj);
            // {login: data.login, pass: data.pass }
            Client.findOne(obj)
                .exec((err, info) => {
                    console.log(err, info);
                    if (err) return rs(false);
                    if (!info) return rs(false);
                    req.user = info.toObject();
                    return rs(info)
                });
        });
    })

};
module.exports.getHash = (obj) => {
    return jwt.sign(obj, backendApp.config.jwtSecret);
};