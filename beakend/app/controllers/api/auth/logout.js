module.exports = (backendApp, router) => {

    router.post('/logout', [], (req,res,next) => {

        const Admin = backendApp.mongoose.model("Client");
        if (req.jwt) {
            const jwt = require('jsonwebtoken');
            const protect = req.cookies['token'] || req.jwt.token;
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
                            if (!info) return res.forbidden("forbidden");
                            info.logout(req,res)
                        });
                }
            });
        } else {
            res.status(401).send('forbidden');
        }
    });
};
