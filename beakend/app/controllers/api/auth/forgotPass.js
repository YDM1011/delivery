const md5 = require('md5');
const jwt = require('jsonwebtoken');
module.exports = (backendApp, router) => {

    router.post('/forgot', [], (req,res,next) => {
        var Client = backendApp.mongoose.model("Client");
        var errors = {};
        if (!req.body.email) {
            errors.login = "Email or Login is required";
        }
        if (Object.keys(errors).length > 0) {
            return res.badRequest(errors);
        }
        Client.findOne({
            $or:[
                {login: req.body.email},
                {email: req.body.email}
            ]
        }, (err, user) => {
            if (err) return res.serverError(err);
            if (!user) return res.notFound("User not found");
            if (user){
                let token = getToken(user.login);
                let newPass = generatePassword();
                let newHashPass = md5(newPass);
                Client
                    .findOneAndUpdate({
                        $or:[
                            {login: req.body.email},
                            {email: req.body.email}
                        ]
                    }, {pass: newHashPass, token: token})
                    .exec((e,r)=>{
                        if (e) return res.serverError(e);
                        if (!r) return res.badRequest('Not Found!');
                        if (r) {
                            res.ok({mess: 'check your mail'});
                            return backendApp.service.email({
                                to: r.email,
                                subject: 'Restore password',
                                temp: 'forgot',
                                tempObj: {
                                    newPass: newPass
                                }
                            },backendApp)
                        }
                    })
            }
        });
    });
};

const generatePassword = () => {
    const length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    let i = 0;
    let n = charset.length;
    for (i; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};
const getToken = login =>{
    console.log(backendApp.config.jwtSecret);
    return jwt.sign({login: login}, backendApp.config.jwtSecret);
};