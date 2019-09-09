const md5 = require('md5');
const jwt = require('jsonwebtoken');
module.exports = (backendApp, router) => {

    const getToken = login =>{
        console.log(backendApp.config.jwtSecret);
        return jwt.sign({login: login}, backendApp.config.jwtSecret);
    };

    const signup = (req,res,next) => {
        const Client = backendApp.mongoose.model("Client");
        let errors = {};



        if (Object.keys(errors).length > 0) {
            return res.badRequest(errors);
        }
        Client.findOne({
            $or:[
                {login: req.body.login.toLowerCase()},
                {email: req.body.login.toLowerCase()}
            ]
        }, (err, user) => {
            if (err) return res.serverError(err);
            if (user) return res.notFound("User with this login created");
            if (!user){
                req.body.token = getToken(req.body.login);
                req.body.pass = md5(req.body.pass);
                // req.body.email = req.body.email ? req.body.email : req.body.login;
                req.body.email = req.body.email ? req.body.email.toLowerCase() : req.body.login.toLowerCase();
                Client.create(req.body, (e,r)=>{
                    if (e) return res.serverError(e);
                    if (!r) return res.badRequest();
                    // r.signin(req,res,backendApp)
                    backendApp.service.email({
                        to: r.email,
                        subject: 'Sign Up',
                        temp: 'hashlink',
                        tempObj: {
                            hashlink: backendApp.service.authlink.getHash({login:req.body.login,pass:req.body.pass})
                        }
                    }, backendApp)
                })
            }
        });
    };

    const validate = (req,res,next) => {
        const err = backendApp.service.signupvalidator(req);
        console.log(err);
        if (err) return res.badRequest(err);
        else return next()
    }

    router.post('/signup', [validate], signup);
};
