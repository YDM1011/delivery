module.exports.preRead = async (req,res,next, backendApp) => {
    next()
};

module.exports.preUpdate = async (req,res,next, backendApp) => {
    // try {
    delete req.body.createdBy;
        switch (parseInt(req.body.status)){
            case 0: req.body.updatedAt = new Date(); return next();
            case 1: req.body.updatedAt = new Date(); return next();
            case 2: req.body.updatedAt = new Date(); return next();
            case 3: req.body.updatedAt = new Date(); return next();
            case 4: req.body.updatedAt = new Date(); return next();
            case 5: req.body.updatedAt = new Date(); return next();
            case 6: req.body.updatedAt = new Date(); return next();
            // case 2:
            //     let superManeger = await checkRole(req, backendApp).catch(e=>{return res.notFound(e)});
            //     if (superManeger && (superManeger.role == req.body.role)) return res.badRequest();
            //     // await assign(req,res,next, backendApp, superManeger._id);
            //     return next();
        }
    // } catch(e) {
    //     res.notFound("Can't be update")
    // }
};

module.exports.postUpdate = async (req, res, next, backendApp) => {

    let basket = req.erm.result;
    if ((basket.status == 1 || basket.status == 2) && !basket.deliveryOwner) {
        // let asgn = await assign(req,res,next, backendApp, basket.cleanerOwner);
        let cleaner = await getCleaner(basket.cleanerOwner).catch(e=>{return rj(e)});
        let valid = await validate(req,res,cleaner,backendApp).catch(e=>{return res.ok(basket)});

        let obj = {
            cleaner:basket.cleanerOwner,
            $push:{orders:basket._id, ordersOpen:basket._id},
            $inc: {ordersCount:1, ordersOpenCount:1},
            updated: new Date(),
        };
        await ActionLogUpdate(req.body.managerCleanerOwner, obj, backendApp, next);
        if (!valid) return next();
        let dataBasket = await updateBasketByCleaner(req, basket.cleanerOwner);
        res.ok(dataBasket);
    } else if (basket.status == 2 && basket.deliveryOwner){
        let delivery = await getDelivery(basket.deliveryOwner).catch(e=>{return rj(e)});
        let valid = await validateDeliveri(req,res,delivery,backendApp).catch(e=>{return res.ok(basket)});
        if (valid === 'mainAssign'){
            return next();
        }else{
            let obj = {
                delivery:basket.deliveryOwner,
                $push:{orders:basket._id, ordersOpen:basket._id},
                $inc: {ordersCount:1, ordersOpenCount:1},
                updated: new Date(),
            };
            await ActionLogUpdate(req.body.managerDeliveryOwner, obj, backendApp, next);
            if (!valid) return next();
            let dataBasket = await updateBasketByCleaner(req, basket.deliveryOwner);
            res.ok(dataBasket);
        }

    } else if (basket.status == 5){
        let cleaner = await getCleaner(basket.cleanerOwner).catch(e=>{return rj(e)});
        let cleanerUpdated = await setMoneyToCleaner(req, basket, cleaner).catch(e=>res.notFound(e));
        res.ok(cleanerUpdated)
    } else {
        next()
    }
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
