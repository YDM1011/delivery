const request = require('request');
const md5 = require('md5');

module.exports = {
    saveToken: (userId) => {
        return new Promise((rs,rj)=> {
            const Client = backendApp.mongoose.model('Client');
            const smsCode = getCode();
            Client.findOneAndUpdate({_id: userId}, {smsCode: md5(smsCode)}, {new: true}).exec((e,r)=>{
                if (e) return rj(e);
                if (!r) return rj("No user");
                if (r) {
                    rs(smsCode)
                }
            })
        })
    },
    send: (mes, phone) => {
        return new Promise((rs,rj)=> {
            let sender = 'Smart';
            request(`https://smsc.ua/sys/send.php?login=andreysmart&psw=Andreysmart&phones=${phone}&mes=${mes}&sender=${sender}`,
                (error, response, body) => {
                    if (error) { rj(error) } else { rs({body:body}) }
                });
        })
    },
    confirmSmsCode: (req, res, backendApp) => {
        const Client = backendApp.mongoose.model('Client');
        req.body.login = req.body.login.slice(-10).toLowerCase();
        return new Promise((rs,rj)=> {
            console.log(req.body)
            Client.findOne({
                $and: [{
                    $or: [
                        {login: req.body.login}
                    ]
                }, {pass: md5(req.body.pass)}, {smsCode: md5(String(req.body.smsCode))}]
            }).exec((err, user) => {
                if (err) return rj(err);
                if (!user) return rj('Password or login invalid!');
                if (user) {
                    Client.findOneAndUpdate({
                        $and: [{
                            $or: [
                                {login: req.body.login},
                                {mobile: req.body.login}
                            ]
                        }, {pass: md5(req.body.pass)}, {smsCode: md5(String(req.body.smsCode))}]
                    }, {verify: true}, {new:true}).exec((e,r)=>{
                        if (e) return rj(e);
                        if (!r) return rj('Password or login invalid!');
                        r.signin(req,res,backendApp);
                    })
                }
            });
        })
    }
};

const getCode = ()=>{
    return String(parseInt(Math.random()*100000))
};
