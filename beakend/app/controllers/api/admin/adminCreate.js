const md5 = require('md5');
const jwt = require('jsonwebtoken');
module.exports = (backendApp, router) => {

    router.post('/adminCreate', [], (req, res, next) => {

        const Admin = backendApp.mongoose.model("Admin");
        let errors = {};
        if (!req.body.login) {
            errors.login = "Login is required";
        }
        if (!req.body.pass) {
            errors.password = "Password is required";
        }
        if (Object.keys(errors).length > 0) {
            return res.badRequest(errors);
        }
        req.body['email'] = req.body.login;
        Admin.findOne({}).exec(function (err, user) {
            if (err) return res.serverError(err);
            if (user) return res.notFound("Admin created!");
            if (!user){
                req.body.token = getToken(req.body.login);
                req.body.pass = md5(req.body.pass);
                req.body.verify = true;
                req.body.email = req.body.email ? req.body.email.toLowerCase() : req.body.login.toLowerCase();
                Admin.create(req.body, (e,r)=>{
                    if (e) return res.serverError(e);
                    if (!r) return res.badRequest("Admin created!");
                    r.signin(req,res,backendApp)
                })
            }
        });
    });

    const getToken = login =>{
        console.log(backendApp.config.jwtSecret);
        return jwt.sign({login: login}, backendApp.config.jwtSecret);
    };
};
