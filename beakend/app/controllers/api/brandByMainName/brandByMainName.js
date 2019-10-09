module.exports = (backendApp, router) => {
    router.get('/brandByMainName/:name/:city', [], (req,res,next) => {
        const brand = req.params.name;
        const maincity = req.params.city;
        const Brand = backendApp.mongoose.model('Brand');
        const Company = backendApp.mongoose.model('Company');
        const response = (e,r,cb) => {
          if (e) res.serverError(e);
          if (!r) res.notFound("Not found!");
          if (r) cb(r);
        };
        const getPromise = (newInfo, mCat) => {
            let result = [];
            newInfo.forEach((company, i)=>{
                result.push(
                new Promise((rs,rj)=>{
                    Category.findOne({companyOwner: company._id, brands:mCat._id})
                        .select('_id')
                        .exec((e,r)=>{
                            if (e) rj(e);
                            if (!r) rs('');
                            if (r){
                                rs({
                                    img: company.img,
                                    _id: company._id,
                                    name: company.name,
                                    brand: r._id,
                                });
                            }
                        })
                })
                )

            });
            return result
        };
        Brand
            .findOne({name:brand})
            .select('_id')
            .exec((e,r)=>{
                response(e,r, mCat=>{
                    Company.find({$and:[
                            {brands: {$in:mCat._id}},
                            {city:maincity}
                        ]})
                        .select('name _id img category')
                        .exec((e,r)=>{
                            response(e,r,info=>{
                                let arr = [];
                                info.forEach(company=>{
                                    arr.push({
                                        img: company.img,
                                        _id: company._id,
                                        name: company.name,
                                        brand: mCat._id,
                                    })
                                });
                                res.ok(arr)
                            })
                        })
                })
            })
    });
    router.get('/orderByBrand/:categoryId/:skip', [], (req,res,next) => {
        const categoryId = req.params.categoryId;
        const skip = parseInt(req.params.skip);
        const limit = 5;
        const Order = backendApp.mongoose.model('Order');
        const response = (e,r,cb) => {
          if (e) res.serverError(e);
          if (!r) res.notFound("Not found!");
          if (r) cb(r);
        };
        Order
            .find({brand:categoryId})
            .limit(limit)
            .skip(skip)
            .exec((e,r)=>{
                console.log(e,r);
                response(e,r, info=>{
                    res.ok(info)
                })
            })
    });
    router.get('/orderByBrandCount/:categoryId', [], (req,res,next) => {
        const categoryId = req.params.categoryId;
        const Order = backendApp.mongoose.model('Order');
        const response = (e,r,cb) => {
          if (e) res.serverError(e);
          if (!r) res.notFound("Not found!");
          if (r) cb(r);
        };
        Order
            .count({brand:categoryId}, (e,r)=>{
                console.log(e,r);
                response(e,r, info=>{
                    res.ok({count:info})
                })
            })
    });

};