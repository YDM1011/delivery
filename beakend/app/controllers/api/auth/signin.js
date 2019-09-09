const md5 = require('md5');
module.exports = (backendApp, router) => {

    const signin = (req,res,next) => {

        const Client = backendApp.mongoose.model("Client");
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
        Client.findOne({
            $and:[{
                $or:[
                    {login: req.body.login.toLowerCase()},
                    {email: req.body.login.toLowerCase()}
                ]
            }],
        }).exec(function (err, user) {
            if (err) return res.serverError(err);
            if (!user) return res.notFound("Password or login invalid!");
            console.log(user.role)
            if (user.role == 'client' || !user.role){
                if (user.pass != md5(req.body.pass)) return res.notFound("Password or login invalid!");
            }
            if (user.role != 'client' && user.role){
                if (user.pass != req.body.pass) return res.notFound("Password or login invalid!");
            }
            user.signin(req,res,backendApp)
        });
    };

    router.post('/signin', [], signin);
};
