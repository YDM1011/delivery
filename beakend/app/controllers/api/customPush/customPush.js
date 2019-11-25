module.exports = (backendApp, router) => {
    router.post('/customPush', [backendApp.middlewares.isLoggedIn], (req,res,next) => {
        if (!req.body.title) return res.notFound("Не указан заголовок!");
        if (req.body.notificationGlobal) {
            backendApp.service.fcm.send({
                title : req.body.title,
                body : req.body.description || '',
            });
            res.ok({mes:"sended"})
        } else {
            const Client = backendApp.mongoose.model('Client');
            if (!req.body.client) return res.notFound({mes:"Не указан клиент!"});
            let query = {$or: []};
            req.body.client.forEach(it=>{
                query.$or.push({_id: backendApp.mongoose.Types.ObjectId(it)})
            });
            Client
                .findOne(query)
                .select('fcmToken')
                .exec((e,r)=>{
                    if (e) return res.serverError(e);
                    if (!r) return res.notFound({mes:"not found1"});

                    let fcmTokens = [];
                    r.forEach(it=>{
                        fcmTokens.push(it.fcmToken)
                    });
                    backendApp.service.fcm.send({
                        title : req.body.title,
                        body : req.body.description || '', //action.description
                    }, '', fcmTokens);
                    res.ok({mes:"sended"})
                });
        }

    });

};