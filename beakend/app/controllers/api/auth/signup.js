const md5 = require('md5');
const jwt = require('jsonwebtoken');
module.exports = (backendApp, router) => {

    const getToken = login =>{
        console.log(backendApp.config.jwtSecret);
        return jwt.sign({login: login}, backendApp.config.jwtSecret);
    };

    const signup = (req,res,next) => {
        const Client = backendApp.mongoose.model("Client");
        const Company = backendApp.mongoose.model("Company");
        let errors = {};



        if (Object.keys(errors).length > 0) {
            return res.badRequest(errors);
        }
        delete  req.body.verify;
        Client.findOne({
            $or:[
                {login: req.body.login.toLowerCase()},
                {mobile: req.body.login.toLowerCase()}
            ]
        }, (err, user) => {
            if (err) return res.serverError(err);
            if (user) return res.notFound("User with this login created");
            if (!user){
                req.body.token = getToken(req.body.login);
                req.body.pass = md5(req.body.pass);
                // req.body.email = req.body.email ? req.body.email : req.body.login;
                req.body.mobile = req.body.mobile ? req.body.mobile.toLowerCase() : req.body.login.toLowerCase();
                if (req.user && req.user.role == 'sa'){
                    req.body.verify = true;
                }
                if (req.user.role === 'provider') {
                    req.body.verify = true;
                    req.body.role = 'collaborator';
                    req.user.companies.forEach((it, i)=>{
                        req.user.companies[i] = it.toString();
                    });
                    if(req.user.companies.indexOf(req.body.companyOwner) > -1) {

                    } else {
                        return res.badRequest('Company error');

                    }
                }
                Client.create(req.body, (e,r)=>{
                    if (e) return res.serverError(e);
                    if (!r) return res.badRequest();

                    if (!req.user) {
                        // r.signin(req,res,backendApp)
                        // verify()
                        return res.badRequest();
                    }
                    if (req.user.role == 'sa'){
                        return postSignup(req, res, r);
                    }
                    if (req.user.role === 'provider') {
                        Company.findOneAndUpdate({_id: req.body.companyOwner}, {$push: {collaborators: r._id}}, {new:true})
                            .exec((e1,r1)=>{
                            if (e1) return res.serverError(e1);
                            if (!r1) return res.badRequest();
                            console.log(r1);
                            return postSignup(req, res, r);
                        });
                    }
                    // backendApp.service.email({
                    //     to: r.email,
                    //     subject: 'Sign Up',
                    //     temp: 'hashlink',
                    //     tempObj: {
                    //         hashlink: backendApp.service.authlink.getHash({login:req.body.login,pass:req.body.pass})
                    //     }
                    // }, backendApp)

                })
            }
        });
    };

    const validate = (req,res,next) => {
        const err = backendApp.service.signupvalidator(req);
        console.log(err);
        if (err) return res.badRequest(err);
        else return next()
    };
    const postSignup = (req, res, result) => {
        const signup = new backendApp.hooks.signupRole(req, res, result);

        signup.end()
    };

    router.post('/signup', [backendApp.middlewares.isLoggedIn], signup);
};

