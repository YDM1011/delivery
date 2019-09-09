module.exports = function (backendApp, router) {

    router.get('/productBy/:cleanerId', [backendApp.middlewares.isLoggedIn], async function (req, res, next) {
        const Product = backendApp.mongoose.model("Product");
        try {
            let Prods = await getBasketsProduct(req,backendApp);
            console.log(Prods);
            if (!Prods || Prods.length==0) return res.ok([]);
            Product.find({
                $or: Prods
            }).exec((e,r)=>{
                if (e) return res.serverError(e);
                if (!r) return res.notFound("One of product is invalid!");
                if (r) {
                    let obj = {};
                    r.map(it=>{
                        obj[it.currentOrder] = it;
                    });
                    res.ok(obj)
                }
            })
        } catch(e) {
            res.notFound("Can't be read")
        }
    });
};

const getBasketsProduct = (req,backendApp) =>{
    const Basket = backendApp.mongoose.model("Basket");
    return new Promise((rs,rj)=>{
        try {
            Basket.find({
                "createdBy.itemId": req.user.id,
                status: 0,
            }).exec((e,r)=>{
                if (e) return rj(e);
                if (!r) return rj("One of product is invalid!");
                if (r) {
                    let arr = [];
                    r.map(it=>{
                        it.products.map(id=>{
                            arr.push({_id:id})
                        })
                        // arr = arr.concat(it.products)
                    });
                    console.log(r, arr);
                    rs(arr)
                }
            })
        } catch(e) {
            rj("Can't be read")
        }
    })

}
