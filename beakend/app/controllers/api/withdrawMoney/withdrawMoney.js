
module.exports = (backendApp, router) => {
    const adminNotification = backendApp.mongoose.model('adminNotification');
    const cleaner = backendApp.mongoose.model('Cleaner');
    router.post('/withdrawMoney/:id', [backendApp.middlewares.isAdmin], async (req, res, next) => {
        let dataWithdraw = await getDataNotification(req, adminNotification).catch(e => {return res.notFound(e)});
        console.log(dataWithdraw);
        console.log(dataWithdraw.amount);
        console.log(dataWithdraw.cleanerId);
        if (dataWithdraw && dataWithdraw.amount && dataWithdraw.cleanerId){
            let dataCleaner = await getDataCleaner(dataWithdraw, cleaner).catch(e => {return res.notFound(e)});
            if (checkAmount(dataCleaner, dataWithdraw)) {
                cleaner.findOneAndUpdate({_id: dataCleaner._id}, {$inc:{money:(dataWithdraw.amount*-1)}})
                    .exec((e,r)=>{
                        if(e) return res.serverError(e);
                        if(!r) return res.notFound('Not found!');
                        if(r) return res.ok(r);
                    })
            }
        } else { return res.badRequest() }
    });
};

const getDataNotification = (req, model) =>{
    return new Promise ((rs,rj) => {
        model.findOne({_id: req.params.id})
            .exec((e,r)=>{
                if(e) return rj(e);
                if(!r) return rj('Not found!');
                if(r) return rs(r);
            })
    })
};

const getDataCleaner = (dataWithdraw, model) =>{
    return new Promise ((rs,rj) => {
        model.findOne({_id: dataWithdraw.cleanerId})
            .exec((e,r)=>{
                if(e) return rj(e);
                if(!r) return rj('Not found!');
                if(r) return rs(r);
            })
    })
};

const checkAmount = (cleaner, dataWithdraw) => {
    return (cleaner.money >= dataWithdraw.amount) ? true : false;
};
