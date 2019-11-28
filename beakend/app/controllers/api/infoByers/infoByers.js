//
const imageToSlices = require('image-to-slices');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

module.exports = (backendApp, router) => {
    router.get('/infoByers', [backendApp.middlewares.isLoggedIn], (req,res,next) => {
        const Basket = backendApp.mongoose.model('Basket');
        const Client = backendApp.mongoose.model('Client');
        const Company = backendApp.mongoose.model('Company');

        try {
            let date = new Date(new Date().getTime() - new Date().getHours()*60*60*1000 - new Date().getMinutes()*60*1000  - new Date().getSeconds()*1000);
            console.log(new Date(date))
            let query = {$and:[{status:4},{lastUpdate:{$gte:date}}]};
            if(req.user.role === 'admin' || req.user.role === 'sa') {
                Basket.aggregate([{ $match:  query },
                    { $group: {
                            _id : {
                                createdBy: "$createdBy",
                                companyOwner: '$companyOwner'
                            },
                            baskets: { $addToSet:
                                    {
                                        _id:"$_id",
                                        totalPrice:"$totalPrice",
                                        lastUpdate:"$lastUpdate",
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
                                    rs()
                                })
                            })
                        }));
                    });
                    Promise.all(promises).then(v=>{
                        res.ok(r)
                    })

                }).catch(e => res.serverError(e))
            } else {
                res.forbidden("forbidden info")
            }
        } catch(e) {
            res.notFound(e)
        }

    });
};

