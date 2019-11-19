const md5 = require('md5');
const jwt = require('jsonwebtoken');
const dbPassConfirm = {};
module.exports = (backendApp, router) => {
    router.post('/forgotPass', [], (req,res,next)=>{
        const Client = backendApp.mongoose.model("Client");
        if (!req.body.login) return res.badRequest('no login');

        Client.findOne({login:req.body.login.slice(-10).toLowerCase()})
            .select('_id login')
            .exec(async  (e,r)=>{
                if (e) return res.serverError(e);
                if (!r) return res.notFound('Unknown user!');
                if (r) {
                    const token = getCode();
                    dbPassConfirm[r.login.slice(-10).toLowerCase()] = token;
                    const result = await backendApp.service.sms.send(token, r.login.slice(-10).toLowerCase());
                    res.ok(result)
                }
            })
    });
    router.post('/confirmPass', [], (req,res,next)=>{
        const Client = backendApp.mongoose.model("Client");
        if (!req.body.login) return res.badRequest('no login');
        if (!req.body.smsCode) return res.badRequest('no confirm');
        if (!req.body.pass || req.body.pass.length < 6) return res.badRequest('no pass or less 6 symbol');
        if (dbPassConfirm[req.body.login] !== req.body.smsCode) {
            delete dbPassConfirm[req.body.login];
            return res.badRequest('no confirm');
        }
        delete dbPassConfirm[req.body.login.slice(-10).toLowerCase()];
        Client.findOneAndUpdate({login:req.body.login.slice(-10).toLowerCase()}, {pass:md5(req.body.pass)})
            .exec(async  (e,r)=>{
                if (e) return res.serverError(e);
                if (!r) return res.notFound('Unknown user!');
                if (r) r.signin(req,res,backendApp)
            })
    });
    router.post('/forgot', [], (req,res,next) => {
        var Client = backendApp.mongoose.model("Client");
        var errors = {};
        if (!req.body.login) {
            errors.login = "Email or Login is required";
        }
        if (Object.keys(errors).length > 0) {
            return res.badRequest(errors);
        }
        Client.findOne({login: req.body.login}, (err, user) => {
            if (err) return res.serverError(err);
            if (!user) return res.notFound("User not found");
            if (user){
                let token = getToken(user.login);
                let newPass = generatePassword();
                let newHashPass = md5(newPass);
                Client
                    .findOneAndUpdate({login: req.body.login}, {pass: newHashPass, token: token})
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
const getCode = ()=>{
    return String(parseInt(Math.random()*100000))
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
    return jwt.sign({login: login}, backendApp.config.jwtSecret);
};