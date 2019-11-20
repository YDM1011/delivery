const md5 = require('md5');
const jwt = require('jsonwebtoken');
module.exports = function (backendApp, router) {

    const getToken = login =>{
        return jwt.sign({login: login}, backendApp.config.jwtSecret);
    };

    /**
     * {_id: client, pass: new client pass}
     */

    router.post('/changePass', [backendApp.middlewares.isLoggedIn], (req, res, next) => {
        const Company = backendApp.mongoose.model('Company');
        const Client = backendApp.mongoose.model('Client');


        if ( req.user.role == 'sa' || req.user.role == 'admin') {
            Client.findOne({_id: req.body._id})
                .exec((e,r)=>{
                    if (e) return res.serverError(e);
                    if (!r) return res.notFound("not found");
                    if (r) {
                        let obj = {
                            token: getToken(r.login),
                            pass: md5(req.body.pass)
                        };
                        Client.findOneAndUpdate({_id: req.body._id}, obj)
                            .exec((e,r)=>{
                                if (e) return res.serverError(e);
                                if (!r) return res.notFound("not found");
                                if (r) return res.ok(r)
                            })
                    }
                })
        } else
        if ( req.user.role == 'provider' || req.user.role == 'client') {
            let obj = {
                token: getToken(req.user.login),
                pass: md5(req.body.pass)
            };
            Client.findOneAndUpdate({_id: req.user._id}, obj)
                .exec((e,r)=>{
                    if (e) return res.serverError(e);
                    if (!r) return res.notFound("not found");
                    if (r) return res.ok(r)
                })
        } else {
            res.forbidden('pass not change')
        }

    });

};

