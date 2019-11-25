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
            .select('client')
            .exec((e,r)=>{
                if (e) return next();
                if (!r) return next();

                let fcmTokens = [];
                r.client.forEach(it=>{
                    fcmTokens.push(it.fcmToken)
                });
                backendApp.service.fcm.send({
                    title : action.name,
                    body : '', //action.description
                }, '', fcmTokens);
                next();
            });

    } else {
        backendApp.service.fcm.send({
            title : action.name,
            body : action.description,
        });
        backendApp.events.callWS.emit('message', JSON.stringify({
            event:"action-confirm",
            data: {data:action}
        }));
        next();
    }
};