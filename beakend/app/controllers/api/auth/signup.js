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
        if (req.body.login) {
            req.body.login = req.body.login.slice(-10).toLowerCase();
        } else
        if (req.body.client && req.body.client.login) {
            req.body.client.login = req.body.client.login.slice(-10).toLowerCase();
        }
        if (req.body.client && req.body.company) {
            req.companyBody = req.body.company;
            req.body = req.body.client
        }
        if (Object.keys(errors).length > 0) {
            return res.badRequest(errors);
        }
        delete  req.body.verify;
        Client.findOne({
            $or:[
                {login: req.body.login}
            ]
        }, (err, user) => {
            if (err) return res.serverError(err);
            if (user) return res.notFound("User with this login created"+user._id);
            if (!user){
                req.body.token = getToken(req.body.login);
                req.body.pass = md5(req.body.pass);
                req.body.mobile = req.body.mobile ? req.body.mobile.toLowerCase() : req.body.login;
                if (req.user){
                    if (req.user.role == 'sa' || req.user.role == 'admin'){
                        req.body.verify = true;
                    }
                    if (req.user.role === 'provider') {
                        req.body.verify = true;
                        req.body.role = 'collaborator';
                        req.user.companies.forEach((it, i)=>{
                            req.user.companies[i] = it.toString();
                        });
                        if(!(req.user.companies.indexOf(req.body.companyOwner) > -1)) {
                            return res.badRequest('Company errors' + req.user._id + req.user.role);
                        }
                    }
                }

                Client.create(req.body, (e,r)=> {
                    if (e) return res.serverError(e);
                    if (!r) return res.badRequest("no found");

                    if (req.user) {
                        if ((req.user.role == 'sa' || req.user.role == 'admin')) {
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
                    } else {
                        console.log(r);
                        return postSignup(req, res, r);
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


    const postSignup = (req, res, result) => {
        const signup = new backendApp.hooks.signupRole(req, res, result, backendApp);
        signup.init()
    };

    router.post('/signup', [backendApp.middlewares.checkLoggedIn], signup);
};

