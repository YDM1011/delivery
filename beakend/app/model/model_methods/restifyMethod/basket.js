module.exports.preRead = async (req,res,next, backendApp) => {
    next()
};

module.exports.preUpdate = async (req,res,next, backendApp) => {
    const Basket = backendApp.mongoose.model('Basket');
    const createChartOrder = (doc, next)=>{
        backendApp.mongoose.model('Company')
            .findOne({_id: doc.companyOwner})
            .select('createdBy')
            .exec((e,r)=>{
                if (r) {
                    backendApp.mongoose.model('ChartOrder')
                        .create({
                            createdBy: r.createdBy,
                            companyOwner: doc.companyOwner,
                            count: 1,
                            status: doc.status,
                            sum: doc.totalPrice,
                            date: new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear())
                        }, (e,r)=>{

                        })
                }
            })

    };
    const updateChartOrder = (doc, ChartOrder, next)=>{
        backendApp.mongoose.model('ChartOrder')
            .findOneAndUpdate({_id:ChartOrder._id}, {
                $inc:{count: 1, sum: doc.totalPrice},
                status: doc.status
            }, (e,r)=>{
            })
    };
    try {

        if (req.user.role === 'provider' || req.user.role === 'collaborator') {
            delete req.body.createdBy;
            Basket.findById(req.params.id)
                .populate({path:'products'})
                .exec((e,r)=>{
                    if (e) return res.serverError(e);
                    if (!r) return res.notFound('Not found!1');
                    if (r) {
                        if (req.body.status === 4 && r.status !== 4) {
                            let date = new Date(new Date().getMonth()+1+'.'+new Date().getDate()+'.'+new Date().getFullYear()).getTime();
                            backendApp.mongoose.model('ChartOrder')
                                .findOne({companyOwner:r.companyOwner, date:{$eq:date}})
                                .exec((e,chart)=>{
                                    if (e) return next();
                                    if (!chart || chart.length==0){
                                        createChartOrder(r)
                                    } else
                                    if (chart) {
                                        updateChartOrder(r, chart)
                                    }
                                })
                            r.products.forEach(prod=>{
                                backendApp.mongoose.model('Order')
                                    .findOneAndUpdate({_id:prod.orderOwner}, {$inc:{countBought:(prod.count)}}, {new:true})
                                    .exec((e,r)=>{ });
                            })
                        }
                        return next();
                    }
                });
        } else {
            return next();
        }

    } catch(e) {
        res.notFound("Can't be update")
    }

};

module.exports.postUpdate = async (req, res, next, backendApp) => {

    let basket = req.erm.result;
    if (req.user.role === 'client') {
        backendApp.mongoose.model('Basket').findById(req.params.id)
            .populate({path:'deliveryAddress', populate:{path:'city'}})
            .populate({path:'createdBy'})
            .populate({path:'manager', select:'name'})
            .populate({path:'companyOwner', select:'name'})
            .exec((e,r)=>{
                if (r) sendToProvider(backendApp, r, req)
            });
    } else if (req.user.role === 'provider' || req.user.role === 'collaborator') {
        backendApp.mongoose.model('Basket').findById(req.params.id)
            .populate({path:'deliveryAddress', populate:{path:'city'}})
            .populate({path:'manager', select:'name'})
            .populate({path:'createdBy'})
            .populate({path:'companyOwner', select:'name'})
            .exec((e,r)=>{
                if (r) sendToClient(backendApp, r, req)
            });
    }

    if (basket.status === 2){
        backendApp.mongoose.model('Debtor')
            .create({
                createdBy: basket.manager,
                clientOwner: basket.createdBy,
                companyOwner: basket.companyOwner,
                value: basket.totalPrice,
                basket: basket._id,
                lastUpdate: new Date(),
                date: new Date(),
                dataCall: new Date(new Date().getTime() + 1000*60*60*24*7)
            }, (e,r)=>{ });
    }
    if (basket.status === 3 || (basket.status === 4 && !req.body.deptor)) {
        backendApp.mongoose.model('Debtor')
            .findOneAndRemove ({
                clientOwner: basket.createdBy,
                basket: basket._id,
            }, (e,r) => {});
    } else if (req.body.deptor) {
        backendApp.mongoose.model('Debtor')
            .findOneAndUpdate ({
                clientOwner: basket.createdBy,
                basket: basket._id,
            }, {lastUpdate: new Date()}, (e,r) => {});
    }
    if (basket.status === 4) {
        backendApp.mongoose.model('Rating')
            .create({
                basketOwner: basket._id,
                clientOwner: basket.createdBy,
                companyOwner: basket.companyOwner,
                rating: 0,
                comment: '',
                lastUpdate: new Date(),
                date: new Date(),
            }, (e,r) => {
                backendApp.events.callWS.emit('message', JSON.stringify({
                    event:"rating-confirm",
                    data: {data:r},
                    to: basket.createdBy
                }));
            });

        backendApp.mongoose.model('Client')
            .findOne({_id:basket.createdBy, byin: {$in: basket.companyOwner}})
            .exec((e,r)=>{
                console.log("CLient");
                console.log(e,r);
                if (!e && !r){
                    backendApp.mongoose.model('Client')
                        .findOneAndUpdate({_id:basket.createdBy}, {$push: {byin: basket.companyOwner}})
                        .exec((e,r)=>{
                            console.log("CLient");
                            console.log(e,r);
                        })
                }
            });
        backendApp.mongoose.model('companyClient')
            .findOne({
                clientOwner: basket.createdBy,
                companyOwner: basket.companyOwner
            })
            .exec((e,r)=>{
                if (!e){
                    if (r) {
                        backendApp.mongoose.model('companyClient')
                            .findOneAndUpdate({
                                clientOwner: basket.createdBy,
                                companyOwner: basket.companyOwner,
                            }, {$inc:{basketCount:1}, lastUpdate: new Date(),}, (e,r) => { });
                    } else {
                        backendApp.mongoose.model('companyClient')
                            .create({
                                basketCount: 1,
                                clientOwner: basket.createdBy,
                                companyOwner: basket.companyOwner,
                                lastUpdate: new Date(),
                                date: new Date(),
                            }, (e,r) => { });
                    }
                }
            });
    }
    next()
    // if (basket.status === 1 || basket.status === 2) {
    //     // let asgn = await assign(req,res,next, backendApp, basket.cleanerOwner);
    //     let cleaner = await getCleaner(basket.cleanerOwner).catch(e=>{return rj(e)});
    //     let valid = await validate(req,res,cleaner,backendApp).catch(e=>{return res.ok(basket)});
    //
    //     let obj = {
    //         cleaner:basket.cleanerOwner,
    //         $push:{orders:basket._id, ordersOpen:basket._id},
    //         $inc: {ordersCount:1, ordersOpenCount:1},
    //         updated: new Date(),
    //     };
    //     await ActionLogUpdate(req.body.managerCleanerOwner, obj, backendApp, next);
    //     if (!valid) return next();
    //     let dataBasket = await updateBasketByCleaner(req, basket.cleanerOwner);
    //     res.ok(dataBasket);
    // } else if (basket.status == 5) {
    //     let cleaner = await getCleaner(basket.cleanerOwner).catch(e=>{return rj(e)});
    //     let cleanerUpdated = await setMoneyToCleaner(req, basket, cleaner).catch(e=>res.notFound(e));
    //     res.ok(cleanerUpdated)
    // } else {
    //     next()
    // }
};

const sendToProvider = (backendApp, basket, req) => {
    backendApp.mongoose.model('Company')
        .findById(basket.companyOwner.id)
        .exec((e,r)=>{
            if (r) {
                backendApp.events.callWS.emit('message', JSON.stringify({
                    event:"order-confirm",
                    data: {data:basket},
                    to: r.createdBy
                }));
                if (r.collaborators && r.collaborators.length>1){
                    r.collaborators.forEach(it=>{
                        backendApp.events.callWS.emit('message', JSON.stringify({
                            event:"order-confirm",
                            data: {data:basket},
                            to: it
                        }));
                    })
                }
            }
        });
};
const sendToClient = (backendApp, basket, req) => {
    if (basket.createdBy.fcmToken) {
        switch (basket.status) {
            case 2:
                backendApp.service.fcm.send({
                    title : 'SMART',
                    body : 'заказ №'+basket.basketNumber+' "'+basket.companyOwner.name+'" на суму '+basket.totalPrice+' был принят!' ,
                }, '', basket.createdBy.fcmToken);
                break;
            case 3:
                backendApp.service.fcm.send({
                    title : 'SMART',
                    body : 'Заказ №'+basket.basketNumber+' "'+basket.companyOwner.name+'" отредактирован!',
                }, '', basket.createdBy.fcmToken);
                break;
            case 4:
                backendApp.service.fcm.send({
                    title : 'SMART',
                    body : 'Заказ №'+basket.basketNumber+' "'+basket.companyOwner.name+'" выполнен!',
                }, '', basket.createdBy.fcmToken);
                break;
            case 5:
                backendApp.service.fcm.send({
                    title : 'SMART',
                    body : 'Заказ №'+basket.basketNumber+' отменьон!',
                }, '', basket.createdBy.fcmToken);
                break;
        }

    }

    backendApp.events.callWS.emit('message', JSON.stringify({
        event:"order-confirm",
        data: {data:basket},
        to: basket.createdBy._id
    }));
};

const assign =  (req,res,next, backendApp, superManeger)=>{
   return new Promise(async (rs,rj)=>{
       let cleaner = await getCleaner(superManeger).catch(e=>{return rj(e)});
       await validate(req,res,cleaner,backendApp).catch(e=>{return rj(e)});
       let update = await updateBasketByCleaner(req,cleaner).catch(e=>{return rj(e)});
       rs()
   })
    // return next();
};

const getCleaner = async superManeger => {
    const Cleaner = backendApp.mongoose.model('Cleaner');
    return new Promise((rs,rj)=>{
        Cleaner.findOne({$or: [{superManager: superManeger},{_id: superManeger}]})
            .exec((e,r)=>{
                if (e) return rj(e);
                if (!r) return rj('not found');
                if (r) return rs(r);
            })
    })
};

const getDelivery = async superManeger => {
    const Delivery = backendApp.mongoose.model('Delivery');
    return new Promise((rs,rj)=>{
        Delivery.findOne({$or: [{superManager: superManeger},{_id: superManeger}]})
            .exec((e,r)=>{
                if (e) return rj(e);
                if (!r) return rj('not found');
                if (r) return rs(r);
            })
    })
};
const updateBasketByCleaner = async (req,cleaner) => {
    const Basket = backendApp.mongoose.model('Basket');
    req.body.status = 2;
    return new Promise((rs,rj)=>{
        Basket.findOneAndUpdate({_id: req.params.id}, req.body, {new:true})
            .exec((e,r)=>{
                console.log("Update basket", e, r);
                if (e) return rj(e);
                if (!r) return rj('not found');
                if (r) return rs(r);
            })
    })
};
const setMoneyToCleaner = async (req,basket, cleaner) => {
    let percentage = await getSettings(req,backendApp).catch(e => {return res.notFound(e)});
    const Basket = backendApp.mongoose.model('Cleaner');
    return new Promise((rs,rj)=>{
        Basket.findOneAndUpdate({_id: cleaner._id},
            {$inc: {money:parsePrice(basket.totalPrice/percentage)}},
            {new:true})
            .exec((e,r)=>{
                if (e) return rj(e);
                if (!r) return rj('not found');
                if (r) return rs(r);
            })
    })
};
const getSettings = (req,backendApp) => {
    const Setting = backendApp.mongoose.model('Setting');
    return new Promise((rs,rj)=>{
        Setting.findOne({})
            .exec((e,r)=>{
                if (e) return rj(e);
                if (!r) return rs({percentage: 1});
                if (r){
                    if(r.percentage || (r.percentage === 0)){
                        rs (parsePrice(r.percentage/100) + 1);
                    }else{
                        return rs(1)
                    }
                }
            });
    })
};
const parsePrice = price => {
    price = String(price);
    price =parseFloat(price.split('.')[1] ?  parseInt(price)+'.'+price.split('.')[1].slice(0,2) : price);
    return price
};
const validate = (req,res,cleaner,backendApp)=>{
    return new Promise((rs,rj)=>{
        const d = req.body;
        if (d.managerCleanerOwner) {
            /** try find auto asign if settings cleaner's set do auto */
            // res.notFound('Manager was not assigned!');
            rs(false)
        } else if (cleaner.autoAssign) {
            backendApp.mongoose.model('ActionLog')
                .findOne({cleaner:cleaner._id})
                .select('ordersOpenCount _id owner')
                .exec((e,r)=>{
                    if (e) return rj(e);
                    if (!r) return rj('not found');
                    if (r) {
                        searchLess(req,res,r,cleaner,backendApp,()=>{
                            let loger;
                            if (req.ActionLog && req.ActionLog.triger){
                                loger = req.ActionLog.triger.owner;
                            }else{
                                loger = r.owner
                            }
                            req.body.managerCleanerOwner = loger ;
                            rs(true)
                        })
                    }
                });
            /** find clients/manager with low orders */
        } else {
            console.log("is Handle")
            rj('Manager was not assigned!');
        }
    })
};

const validateDeliveri = (req,res,cleaner,backendApp)=>{
    return new Promise((rs,rj)=>{
        const d = req.body;
        if (d.managerDeliveryOwner) {
            /** try find auto asign if settings cleaner's set do auto */
            // res.notFound('Manager was not assigned!');
            rs(false)
        } else if (cleaner.autoAssign) {
            backendApp.mongoose.model('ActionLog')
                .findOne({cleaner:cleaner._id})
                .select('ordersOpenCount _id owner')
                .exec((e,r)=>{
                    if (e) return rj(e);
                    if (!r) return rj('not found');
                    if (r) {
                        searchLessDelivery(req,res,r,cleaner,backendApp,()=>{
                            let loger;
                            if (req.ActionLog && req.ActionLog.triger){
                                loger = req.ActionLog.triger.owner;
                            }else{
                                loger = r.owner
                            }
                            req.body.managerDeliveryOwner = loger ;
                            rs(true)
                        })
                    }
                });
            /** find clients/manager with low orders */
        } else {
            rs('mainAssign')
        }
    })
};
const ActionLogUpdate = (id, data, backendApp)=>{
    return new Promise((rs,rj)=>{
        backendApp.mongoose.model('ActionLog')
            .findOneAndUpdate({owner:id}, data).exec((e,r)=> {
            if (e) return rj(e);
            if (!r) return rj('not found');
            if (r) return rs(r);
        })
    })
};

const searchLess = (req,res,log,cleaner,backendApp,next)=>{
    backendApp.mongoose.model('ActionLog')
        .findOne({cleaner:cleaner._id, ordersOpenCount: { $lt: log.ordersOpenCount } })
        .select('ordersOpenCount _id owner')
        .exec((e,r)=>{
            if (e) return res.serverError(e);
            if (!r) next();
            if (r) {
                req['ActionLog'] = {triger: r};
                console.log("triger",req.ActionLog.triger);
                searchLess(req,res,r,cleaner,backendApp,next)
            }
        });
};

const searchLessDelivery = (req,res,log,cleaner,backendApp,next)=>{
    backendApp.mongoose.model('ActionLog')
        .findOne({delivery:cleaner._id, ordersOpenCount: { $lt: log.ordersOpenCount } })
        .select('ordersOpenCount _id owner')
        .exec((e,r)=>{
            if (e) return res.serverError(e);
            if (!r) next();
            if (r) {
                req['ActionLog'] = {triger: r};
                console.log("triger",req.ActionLog.triger);
                searchLessDelivery(req,res,r,cleaner,backendApp,next)
            }
        });
};
const checkRole = (req, backendApp) => {
    return new Promise((rs,rj)=>{
        const error = 'Role is invalid';
        const client = backendApp.mongoose.model('Client');
        const action = (e,r) => {
            if (e) return rj(error);
            if (!r) return rj(error);
            if (r) return rs(r);
        };
        console.log();
        client.findOne({_id:req.user._id}).exec(action);
    });
};

// module.exports.PreDel = async (req,res,next, backendApp) => {
//     const Product = backendApp.mongoose.model('Product');
//     const Basket = backendApp.mongoose.model('Basket');
//     try {
//         Product.findById(req.params.id)
//             .exec((e,r)=>{
//                 if (e) return res.serverError(e);
//                 if (!r) return res.notFound('Not found!');
//                 if (r) {
//                     let inc = r.price*(0-r.count);
//                     Basket.findOneAndUpdate({
//                         "createdBy.userId": req.user.id,
//                         products:{$in:req.params.id},
//                         status: 0
//                     }, { $inc: {totalPrice:inc} }, {new:true})
//                         .exec((e,r)=>{
//                             if (e) return res.serverError(e);
//                             if (!r) return res.notFound('Not found!');
//                             if (r) {next()};
//                         })
//                 };
//             });
//     } catch(e) {
//         res.notFound("Can't be update")
//     }
// };
