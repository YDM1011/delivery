// module.exports.preSave = async (req,res,next, backendApp) => {
//     try {
//         if (req.body.basketGroup.baskets.length>0) {
//             const user = await backendApp.service.checkrole(req, backendApp).catch(e=>{return res.notFound(e)});
//             if (user){
//                 const products = await asyncCreator(req.body.basketGroup.baskets.products);
//                 req.body.basketGroup.baskets.products = products;
//                 const baskets = await asyncCreator(req.body.basketGroup.baskets)
//             }
//         } else {
//             next()
//         }
//     } catch(e) {
//         res.notFound("Can't be create")
//     }
// };

const createProduct = (data,backendApp) => {
    const Product = backendApp.mongoose.model('Product');
    return new Promise((rs,rj)=>{
        Product.create(data,(e,r)=>{
            if (e) return rj(e);
            if (!r) return rj("One of product is invalid!");
            if (r) return rs(r)
        });
    })
};
const createBasket = (data,backendApp) => {
    const Product = backendApp.mongoose.model('Basket');
    return new Promise((rs,rj)=>{
        Product.create(data,(e,r)=>{
            if (e) return rj(e);
            if (!r) return rj("One of Basket is invalid!");
            if (r) return rs(r)
        });
    })
};

const parseToIdArr = arr => {
    let arrRes = [];
    arr.map(obj=>{
        arrRes.push(obj._id)
    });
    return arrRes;
};

const asyncCreator = (arr, fun, backendApp) => {
    return new Promise(async (rs,rj)=>{
        let result = () => {
            return new Promise(async (rs,rj)=>{
                let arrData = [];
                for(let i=0; i<arr.length; i++){
                    let item = await fun(arr[i], backendApp);
                    arrData.push(item);
                    if (arr.length == arrData.length){
                        let dat = parseToIdArr(arrData);
                        rs(dat);
                    }
                }
            })
        };
        let d = await result();
        rs(d)
    })
};
