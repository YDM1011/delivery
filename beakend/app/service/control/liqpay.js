const LiqPay = require('liqpay-sdk');


module.exports =  {
    getBtnPay: (userId, backendApp) => {
        /**
         * orderId складаеться з 2 частин <user id>--<date time>
         * @type {*|exports}
         */
        return new Promise((rs,rj)=> {
            backendApp.mongoose.model('Admin')
                .findOne({})
                .exec((ea, ra) => {
                    if (ea) return rj(ea);
                    if (!ra) return rj("");
                    if (!ra.privateKey || !ra.privateKey ||
                    !ra.payDate || !ra.amount) return rj("error LiqPay!");
                    let liqpay = new LiqPay(ra.publikKey, ra.privateKey);
                    let html = liqpay.cnb_form({
                        'action': 'pay',
                        'amount': ra.amount,
                        'currency': 'UAH',
                        'description': 'Оплата за ' + ra.payDate + ' месец(а)',
                        'order_id': userId+'--'+new Date(new Date().setMonth(new Date().getMonth()+ra.payDate)),
                        'version': '3',
                        'sandbox': '0',
                        'server_url': 'https://provider.' + backendApp.config.site.sidDomain + 'api/liqpay/callback'
                    });
                    rs(html);
                });
        });
    },
    checkCallback: (req, backendApp)=>{
        return new Promise((rs,rj)=>{
            backendApp.mongoose.model('Admin')
                .findOne({})
                .exec((ea,ra)=>{
                    if (ea) return rj(ea);
                    if (!ra) return rj("error");
                    if (!ra.privateKey) return rj("error privateKey");
                    let sign = liqpay.str_to_sign(ra.privateKey + req.body.data + ra.privateKey);
                    let data = new Buffer(req.body.data, 'base64').toString();
                    if(req.body.signature == sign){
                        let Order = JSON.parse(data);
                        if (Order.status == "sandbox" || Order.status == "success"){
                            mongoose.model('Client')
                                .findOneAndUpdate({_id:Order['order_id'].split("_")[0]},{payedAt:Order['order_id'].split("_")[1]})
                                .exec((e,r)=>{
                                    if (e) return rj(e);
                                    if (!r) return rj("error");
                                    if (r){
                                        rs(r)
                                    }
                                })
                        } else {
                            rs({})
                        }
                    }
                });
        });
    }
};

