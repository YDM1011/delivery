module.exports.preUpdate = (req, res, next, backendApp) => {
    delete req.body.createdBy;
    if (req.body.city) {
        backendApp.mongoose.model('Company')
            .findOne({_id: req.params.id})
            .exec((e,r)=>{
                if (!r || e) res.serverError();
                backendApp.mongoose.model('cityLink')
                    .findOneAndUpdate({_id: r.cityLink}, {cityOwner: req.body.city})
                    .exec((e1,r1)=>{
                        backendApp.mongoose.model('City')
                            .findOneAndUpdate({links:{$in:r.cityLink}}, {$pull:{links: r.cityLink}})
                            .exec((e2,r2)=>{
                                backendApp.mongoose.model('City')
                                    .findOneAndUpdate({_id:req.body.city}, {$push:{links: r.cityLink}})
                                    .exec((e3,r3)=>{
                                        next()
                                    })
                            })
                    })
            })

    } else {
        next()
    }
};
// module.exports.postRead = (req,res,next, backendApp)=>{
//     let companies = req.erm.result;
//     let arrPromise = [];
//     let result = [];
//     companies.forEach((company,i)=>{
//         arrPromise.push(new Promise((rs,rj)=>{
//             backendApp.mongoose.model('Action')
//                 .count({$or:[{actionGlobal:true},{client:{$in:req.user._id}}], companyOwner:company._id})
//                 .exec((e,r)=>{
//
//                     company['actionCount'] = r || 0;
//                     result.push(company);
//                     console.log(result);
//                     rs(r)
//                 })
//         }))
//     });
//     Promise.all(arrPromise).then(v=>{
//         res.ok(result)
//     })
// };