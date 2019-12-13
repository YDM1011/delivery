module.exports.preSave = async (req,res,next, backendApp) => {
    if (req.body.companyOwner) {
        backendApp.mongoose.model('Company')
            .findOne({_id:req.body.companyOwner})
            .select('cityLink')
            .exec((e,r1)=>{
                if (e) return res.serverError(e);
                if (!r1) return res.notFound("Not Found Category");
                req.body['cityLink'] = r1.cityLink;
                next()
            })
    } else {
        next()
    }
};
module.exports.postCreate = async (req,res,next, backendApp) => {
    let action = req.erm.result;
    if (action.client && action.client.length > 0) {

        action.client.forEach(id=>{
            backendApp.events.callWS.emit('message', JSON.stringify({
                event:"action-confirm",
                data: {data:action},
                to: id
            }));
        });

        backendApp.mongoose.model('Action')
            .findOne({_id:action._id})
            .populate({path: 'client', select:'fcmToken'})
            .populate({path: 'companyOwner', select:'name'})
            .select('client companyOwner')
            .exec((e,r)=>{
                if (e) return next();
                if (!r) return next();

                let fcmTokens = [];
                console.log(r);
                r.client.forEach(it=>{
                    fcmTokens.push(it.fcmToken)
                });
                backendApp.service.fcm.send({
                    title : 'Акция в '+r.companyOwner.name,
                    body : action.name
                }, '', fcmTokens);
                next();
            });

    } else {
        backendApp.mongoose.model('Action')
            .findOne({_id:action._id})
            .populate({path: 'companyOwner', select:'name city'})
            .select('companyOwner')
            .exec((e,r)=>{
                if (e) return next();
                if (!r) return next();
                backendApp.mongoose.model('Client')
                    .find({city: r.city})
                    .select('fcmToken')
                    .exec((err, client)=>{
                        if(err) return next();
                        if (!client) return next();
                    });
                let fcmTokens = [];
                client.forEach(it=>{
                    fcmTokens.push(it.fcmToken)
                });
                backendApp.service.fcm.send({
                    title : 'Акция в '+r.companyOwner.name,
                    body : action.name
                }, '', fcmTokens);
                // next();
                // backendApp.service.fcm.send({
                //     title : 'Акция в '+r.companyOwner.name,
                //     body : action.name
                // });

                let clientArr = [];
                client.forEach(it=>{
                    clientArr.push(it._id)
                });
                backendApp.events.callWS.emit('message', JSON.stringify({
                    event:"action-confirm",
                    to:clientArr,
                    data: {data:action}
                }));
            });


        next();
    }
};