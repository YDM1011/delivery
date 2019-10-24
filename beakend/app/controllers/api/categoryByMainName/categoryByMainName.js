module.exports = (backendApp, router) => {
    router.get('/categoryByMainName/:name', [], (req,res,next) => {
        const mainCategoryName = req.params.name;
        const maincity = req.params.city;
        const mainCategory = backendApp.mongoose.model('MainCategory');
        const Category = backendApp.mongoose.model('Category');
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
                    Category.findOne({companyOwner: company._id, mainCategory:mCat._id})
                        .select('_id')
                        .exec((e,r)=>{
                            if (e) rj(e);
                            if (!r) rs('');
                            if (r){
                                rs({
                                    img: company.img,
                                    _id: company._id,
                                    name: company.name,
                                    category: r._id,
                                });
                            }
                        })
                })
                )
            });
            return result
        };
        mainCategory
            .findOne({name:mainCategoryName})
            .exec((e,r)=>{
                if (e) res.serverError(e);
                if (!r) res.notFound("Not found!")
                if (r) res.ok(r)
            })
    });
    router.get('/orderByCategory/:categoryId/:skip', [], (req,res,next) => {
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
            .find({categoryOwner:categoryId})
            .limit(limit)
            .skip(skip)
            .exec((e,r)=>{
                console.log(e,r);
                response(e,r, info=>{
                    res.ok(info)
                })
            })
    });
    router.get('/orderByCategoryCount/:categoryId', [], (req,res,next) => {
        const categoryId = req.params.categoryId;
        const Order = backendApp.mongoose.model('Order');
        const response = (e,r,cb) => {
          if (e) res.serverError(e);
          if (!r) res.notFound("Not found!");
          if (r) cb(r);
        };
        Order
            .count({categoryOwner:categoryId}, (e,r)=>{
                console.log(e,r);
                response(e,r, info=>{
                    res.ok({count:info})
                })
            })
    });

};