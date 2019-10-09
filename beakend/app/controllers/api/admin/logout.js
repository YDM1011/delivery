module.exports = (backendApp, router) => {

    router.post('/adminLogout', [], (req,res,next) => {

        const Admin = backendApp.mongoose.model("Admin");
        const Client = backendApp.mongoose.model("Client");
        if (req.jwt) {
            const jwt = require('jsonwebtoken');
            const protect = req.cookies['adminToken'] || req.jwt.token || req.headers.authorization;
            if(!protect){
                return res.forbidden("forbidden");
            }
            const connect = protect.split(" ");
            jwt.verify(connect[0], backendApp.config.jwtSecret, (err,data)=>{
                if (err) {
                    return res.serverError("Token error");
                }else{
                    Admin.findOne({login: data.login })
                        .exec((err, info)=>{
                            if (err) return res.serverError(err);
                            if (!info) {
                                Client.findOne({login: data.login })
                                    .exec((err, info)=>{
                                        if (err) return res.serverError(err);
                                        if (!info) return res.forbidden("forbidden");
                                        info.logout(req,res,backendApp)
                                    });
                            }
                            if (info) return info.logout(req,res,backendApp)
                        });
                }
            });
        } else {
            res.status(401).send('forbidden');
        }
    });
};
