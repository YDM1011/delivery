const md5 = require('md5');
module.exports = (backendApp, router) => {

    router.post('/adminChangePass', [], (req,res,next) => {

        const Admin = backendApp.mongoose.model("Admin");
        if (req.jwt) {
            const jwt = require('jsonwebtoken');
            const protect = req.cookies['adminToken'] || req.jwt.token;
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
                            Admin.findOneAndUpdate({pass: md5(req.body.pass)})
                                .exec((e,r)=>{
                                    if (e) return res.serverError(e);
                                    if (!r) return res.notFound('Error');
                                    if (r) return res.ok(r);
                                })
                        });
                }
            });
        } else {
            res.status(401).send('forbidden');
        }
    });
};
