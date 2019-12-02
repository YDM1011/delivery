//
const imageToSlices = require('image-to-slices');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

module.exports = (backendApp, router) => {
    router.get('/infoByers', [backendApp.middlewares.isLoggedIn], (req,res,next) => {


        try {
            let date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000);
            let query = {$and:[{status:4},{lastUpdate:{$gte:date}}]};
            if(req.user.role === 'admin' || req.user.role === 'sa') {
                callInfo(req,res,query)
            } else if (req.user.role === 'provider') {
                query.$and.push({companyOwner: req.user.companyOwner});
                callInfo(req,res,query)
            } else {
                res.forbidden("forbidden info")
            }
        } catch(e) {
            res.notFound(e)
        }

    });
    const callInfo = (req,res,query) => {
        const Basket = backendApp.mongoose.model('Basket');
        const Client = backendApp.mongoose.model('Client');
        const Company = backendApp.mongoose.model('Company');
        Basket.aggregate([{ $match:  query },
            { $group: {
                    _id : {
                        createdBy: "$createdBy",
                        companyOwner: '$companyOwner'
                    },
                    baskets: { $addToSet:
                            {
                                _id:"$_id"
                            }
                    },
                    sum : { $sum: "$totalPrice" },
                }
            }
        ]).then(r => {

            if (r.length === 0) return res.ok({
                _id: null,
                sum: 0,
                count: 0
            });
            let promises = [];
            r.forEach((obj)=>{
                promises.push(new Promise((rs,rj)=>{
                    Client.findById(obj._id.createdBy, (e,r)=>{
                        obj._id.createdBy = r;
                        Company.findById(obj._id.companyOwner, (e,r)=>{
                            obj._id.companyOwner = r;

                            Basket.find({$or:obj.baskets})
                                .populate({path:'deliveryAddress', populate:{path:'city'}})
                                .populate({path:'manager', select:"name"})
                                .populate({path:'products', populate:{path:'orderOwner'}})
                                .exec((e,r)=>{
                               obj.baskets = r;
                               rs()
                            });

                        })
                    })
                }));
            });
            Promise.all(promises).then(v=>{
                res.ok(r)
            })

        }).catch(e => res.serverError(e))
    }
};

