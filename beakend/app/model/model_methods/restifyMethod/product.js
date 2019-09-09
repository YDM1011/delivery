module.exports.preRead = async (req,res,next, backendApp) => {
    await readStep (req,res,next, backendApp);
    next()
    // return [readStep]
};

const readStep = async (req,res,next,backendApp) => {
    return new Promise((rs,rj)=>{
        // req.erm.query = {populate:{path:'superManager'}};
        console.log("ok!!!",req.erm);
        rs()
    })
};

module.exports.preUpdate = async (req,res,next, backendApp) => {
    const Product = backendApp.mongoose.model('Product');
    const Basket = backendApp.mongoose.model('Basket');
    delete req.body.price;
    req.percentage = await getSettings(req,backendApp).catch(e => {return res.notFound(e)});
    try {
        Product.findById(req.params.id)
            .exec((e,r)=>{
                if (e) return res.serverError(e);
                if (!r) return res.notFound('Not found!');
                if (r) {
                    let inc = parsePrice((r.price)*(req.body.count - r.count));
                    Basket.findOneAndUpdate({
                        "createdBy.itemId": req.user.id,
                        _id: req.body.basketOwner,
                        status: 0
                    }, { $inc: {totalPrice:inc} }, {new:true})
                        .exec((e,r)=>{
                            if (e) return res.serverError(e);
                            if (!r) return res.notFound('Not found!');
                            if (r) {next()};
                        })
                };
            });
    } catch(e) {
        res.notFound("Can't be update")
    }
};


module.exports.preSave = async (req, res, next, backendApp) => {
    req.percentage = await getSettings(req,backendApp).catch(e => {return res.notFound(e)});
    console.log("Percentage",req.percentage)
    // try {
        if (req.body) {
            // let user = await checkUser(req, res, backendApp).catch(e => {return res.notFound(e)});
            // if (user) {
            console.log(req.user._id)
                req.body['createdBy'] = {itemId:req.user._id};
                // console.log(req.body, user, req.user)
                let product = await createProduct(req, backendApp).catch(e => {return res.notFound(e)});
                console.log("product",product);
                let basket = await checkAndInitBasket(req, backendApp, product).catch(e => {return res.notFound(e)});
                await setBasketToProduct(product, backendApp, basket).catch(e => {return res.notFound(e)});
                product.basketOwner = basket._id;
                res.ok(product);
            // }
            // console.log(manager, "maneger");
        } else {
            next()
        }
    // } catch(e) {
    //     res.notFound("Can't be create")
    // }
};
const checkAndInitBasket = (req, backendApp, product) => {
    const Basket = backendApp.mongoose.model('Basket');
    return new Promise ((rs,rj)=>{
        Basket.findOne({
            "createdBy.itemId": req.user.id,
            cleanerOwner: req.body.cleanerOwner,
            status: 0
        }).exec((e,r)=>{
            if (e) return rj(e);
            if (!r){
                let data = {
                    'createdBy.itemId': req.user._id,
                    products: [product._id],
                    cleanerOwner: req.body.cleanerOwner,
                    totalPrice: parsePrice(product.count*(product.price)),
                    status: 0,
                    date: new Date()
                };
                Basket.create(data, (e,r)=>{
                    if (e) return rj(e);
                    if (!r) return rj('Not found!');
                    if (r) return rs(r);
                })
            }
            if (r) {
                Basket.findOneAndUpdate({
                    "createdBy.itemId": req.user.id,
                    cleanerOwner: req.body.cleanerOwner,
                    status: 0
                }, {$push:{products:product._id}, $inc: {totalPrice:parsePrice(product.count*product.price)}}, {new:true})
                    .exec((e,r)=>{
                        if (e) return rj(e);
                        if (!r) return rj('Not found!');
                        if (r) return rs(r);
                    })
            }
        })
    })
};

const createProduct = (req,backendApp) => {
    let data = req.body;
    const Product = backendApp.mongoose.model('Product');
    const Order = backendApp.mongoose.model('Order');
    return new Promise((rs,rj)=>{
        Order.findOne({_id:data.currentOrder})
            .exec((e0,r0)=>{
                if (e0) return rj(e0);
                if (!r0) return rj("One of product is invalid!");
                data.price = parsePrice(r0.price*req.percentage);
                console.log(data)
                Product.create(data,(e,r)=>{

                    if (e) return rj(e);
                    if (!r) return rj("One of product is invalid!");
                    if (r) return rs(r)
                });
            })
    })
};

const setBasketToProduct = (data,backendApp,basket) => {
    const Product = backendApp.mongoose.model('Product');
    return new Promise((rs,rj)=>{
        Product.findOneAndUpdate({_id:data._id}, {basketOwner: basket._id})
            .exec((e,r)=>{
                if (e) return rj(e);
                if (!r) return rj("One of product is invalid!");
                if (r) return rs(r)
            });
    })
};

const checkUser = (req,res,backendApp)=>{
    return new Promise((rs,rj)=>{
        backendApp.middlewares.isLoggedIn(req, res, (e = true)=>{
            rs(e)
        })
    })
};

const getSettings = (req,backendApp) => {
    const Setting = backendApp.mongoose.model('Setting');
    return new Promise((rs,rj)=>{
        Setting.findOne({})
            .exec((e,r)=>{
                console.log(e,r,"tew")
                if (e) return rj(e);
                if (!r) return rs({percentage: 1});
                if (r){
                    if(r.percentage || (r.percentage === 0)){
                        rs (parsePrice(r.percentage/100 + 1));
                    }else{
                        return rs(1)
                    }
                }
            });
    })
};

const parsePrice = price => {
    price = String(price)
    price =parseFloat(price.split('.')[1] ?  parseInt(price)+'.'+price.split('.')[1].slice(0,2) : price);
    return price
};
