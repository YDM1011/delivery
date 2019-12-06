const cron = require('node-cron');
const mongoose = require('mongoose');

cron.schedule("0 30 9 * * *", ()=>{

    console.log("Work!!!", new Date());
    // try {
        console.log({pushDay: new Date().getDay()})
    const companyClient = mongoose.model("Client");
    companyClient
        .find({pushDay: {$in: new Date().getDay()} })
        .populate({path: 'clientOwner', select:'fcmToken'})
        .populate({path: 'companyOwner', select:'name'})
        .exec((e,r)=>{
            if (!e) {
                if (r && r.length > 0) {
                    let fcmTokens = [];
                    r.forEach(it=>{
                        if (it.clientOwner.fcmToken) {
                            fcmTokens.push(it.clientOwner.fcmToken)
                        }
                    });
                    global.backendApp.service.fcm.send({
                        title : 'Сегодня день заявки у "'+r.name+'"',
                        body : ''
                    }, '', fcmTokens);
                } else {
                    global.backendApp.service.fcm.send({
                        title : new Date(),
                        body : ''
                    });
                }
            }
        })
    // }catch(e){}

});