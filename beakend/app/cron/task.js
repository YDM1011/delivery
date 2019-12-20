const cron = require('node-cron');
const mongoose = require('mongoose');

cron.schedule("0 30 9 * * *", ()=>{

    console.log("Work!!!", new Date());
    // try {
    const companyClient = mongoose.model("companyClient");
    companyClient
        .find({pushDay:new Date().getDay()})
        .populate({path: 'clientOwner', select:'fcmToken'})
        .populate({path: 'companyOwner', select:'name'})
        .exec((e,r)=>{

            if (!e) {
                if (r && r.length > 0) {
                    r.forEach(it=>{
                        if (it.clientOwner.fcmToken && it.companyOwner) {
                            global.backendApp.service.fcm.send({
                                title : 'Сегодня день заявки у "'+it.companyOwner.name+'"',
                                body : ''
                            }, '', it.clientOwner.fcmToken);
                        }
                    });

                }
            }
        })
    // }catch(e){}

});