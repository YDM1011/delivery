const md5 = require('md5');
module.exports = (backendApp, router) => {

    router.post('/adminSignin', [], (req,res,next) => {

        const Admin = backendApp.mongoose.model("Admin");
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
        Admin.findOne({
            $and:[{
                $or:[
                    {login: req.body.login.toLowerCase()},
                    {mobile: req.body.login.toLowerCase()}
                ]
            },{pass:md5(req.body.pass)}],
        }).exec(function (err, user) {
            if (err) return res.serverError(err);
            if (!user) {
                // return res.notFound('Password or login invalid!');
                Client.findOne({
                    $and:[{
                        $or:[
                            {login: req.body.login.toLowerCase()},
                            {mobile: req.body.login.toLowerCase()}
                        ]
                    },{pass:md5(req.body.pass)}],
                }).exec(function (err, user) {
                    console.log(err,user);
                    if (err) return res.serverError(err);
                    if (!user) {
                        return res.notFound('Password or login invalid!');
                    }
                    if (user && user.role == 'admin') {
                        user.signin(req,res,backendApp)
                    } else {
                        return res.notFound('Password or login invalid for Admin!');
                    }

                });
            }
            if (user) return user.signin(req,res,backendApp)
        });
    });
};
