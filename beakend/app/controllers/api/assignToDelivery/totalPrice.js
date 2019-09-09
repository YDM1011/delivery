const fs = require('fs');
module.exports = function (backendApp, router) {

    router.get('/assignToDelivery/:id', [backendApp.middlewares.isLoggedIn], async function (req, res, next) {
        const Basket = backendApp.mongoose.model('Basket');
        try {
            Basket.find({"createdBy.itemId":req.user._id, status:req.params.status, cleanerOwner:{$exists:true}})
                .exec((e,r)=>{
                    if (e) return res.serverError(e);
                    if (!r) return res.notFound('Not found!');
                    if (r) {
                        let price = 0;
                        r.map(obj=>{
                            price += obj.totalPrice
                        });
                        console.log(price, price%0.01);
                        price = String(price)
                        price =parseFloat(price.split('.')[1] ?  parseInt(price)+'.'+price.split('.')[1].slice(0,2) : price);
                        console.log(price)
                        res.ok({totalPrice:price})
                    };
                })
        } catch(e) {
            res.notFound("Can't be valid")
        }
        // res.ok(r)
    });
};
