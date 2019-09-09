module.exports.preRead = async (req,res,next, backendApp) => {
    next()
    // return [readStep]
};

module.exports.preUpdate = async (req,res,next, backendApp) => {
    // if (typeof req.body.manager == 'object'){
    //     let manager = await createManeger(req, backendApp).catch(e=>{res.notFound(e)});
    //     next()
    // } else {
    //     next()
    // }
    next()
};

// const createManeger = (req, backendApp) => {
//     return new Promise((rs,rj)=>{
//
//     })
// };
