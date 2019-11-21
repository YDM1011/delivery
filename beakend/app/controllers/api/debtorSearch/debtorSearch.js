
module.exports = (backendApp, router) => {

    /**
     * api/debtorSearch/<Number>
     *     ?populate={"path":"createdBy"} - не обовязковий параметр запита для попюлейта дептора
     *     по замовчуваню попюлейт clientOwner
     *
     * 200 {} - поверниться якщо нычого не знайдено
     * 404 not found - поверниться якщо э номер замовлення/кошик але
     *      дептор выдсутны по причины видалення або серверноъ помилки
     *
     * 200 {
     *      basket:...,
     *      debtor:...
     *     }  - поверниться при успішному пошуку
     */

    router.get('/debtorSearch/:basketNumber', [backendApp.middlewares.isLoggedIn], (req, res, next) => {
        const Debtor = backendApp.mongoose.model('Debtor');
        const Basket = backendApp.mongoose.model('Basket');
        Basket.findOne({basketNumber:req.params.basketNumber})
            .populate({path:"deliveryAddress", populate:{path:"city"}})
            .populate({path:"manager"})
            .exec((e,rb)=>{
                if (e) return res.serverError(e);
                if (!rb) return res.ok({});

                Debtor.findOne({basket:rb._id})
                    .populate(req.query.populate ? JSON.parse(req.query.populate) : {path:"clientOwner"})
                    .exec((e,r)=>{
                        if (e) return res.serverError(e);
                        if (!r) return res.notFound('not found');
                        if (r) {
                            res.ok({basket:rb,debtor:r})
                        }
                    })
            })
    });

};

