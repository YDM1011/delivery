module.exports = (backendApp, router) => {
    router.post('/customPush', [backendApp.middlewares.isLoggedIn], (req,res,next) => {
        if (!req.body.title) return res.notFound("Не указан заголовок!");
        if (req.body.notificationGlobal) {
            backendApp.service.fcm.send({
                title : req.body.title,
                body : req.body.description || '',
            });
            res.ok({mes:"sended"})
        } else if(req.body.client && req.body.client.length > 0) {
            const Client = backendApp.mongoose.model('Client');
            if (!req.body.client) return res.notFound({mes:"Не указан клиент!"});
            let query = {$or: []};
            req.body.client.forEach(it=>{
                query.$or.push({_id: backendApp.mongoose.Types.ObjectId(it)})
            });
            Client
                .find(query)
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
        } else if (req.body.city) {
            const shopAddress = backendApp.mongoose.model('shopAddress');

            shopAddress
                .find({city: req.body.city})
                .select('createdBy')
                .populate({path:'createdBy',select:'fcmToken'})
                .exec((e,r)=>{
                    if (e) return res.serverError(e);
                    if (!r) return res.notFound({mes:"not found1"});

                    let fcmTokens = [];
                    r.forEach(it=>{
                        fcmTokens.push(it.createdBy.fcmToken)
                    });
                    console.log(fcmTokens)
                    backendApp.service.fcm.send({
                        title : req.body.title,
                        body : req.body.description || '', //action.description
                    }, '', fcmTokens);
                    res.ok({mes:"sended"})
                });
        }

    });

};