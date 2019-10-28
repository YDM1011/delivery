const fs = require('fs');
module.exports = function (backendApp, router) {

    router.get('/test', [], async function (req, res, next) {
        backendApp.mongoose.model('Client')
            .findOne({})
            .sort({date:-1})
            .exec((e,r)=>{
                res.ok(r)
            });
    });
    router.get('/test2', [], async function (req, res, next) {
        backendApp.service.authlink.parseHash(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluMSIsInBhc3MiOiIxMjMiLCJpYXQiOjE1Njc0MjQ3MDh9.-Vh0t-MF4Pm6aMmznobmCQNcGjyIdb7V6KOuZzYbrkg",
        {login:"",pass:""}, req).then(v => {
            v.signin(req,res,backendApp)
            // res.ok(req.user)
        })

    });
};
const convertation = b64string =>{
    let buf;
    if (typeof Buffer.from === "function") {
        buf = Buffer.from(b64string, 'base64'); // Ta-da
    } else {
        buf = new Buffer(b64string, 'base64'); // Ta-da
    }
    return buf;
};

const asyncForEach = (arr, fun, backendApp) => {
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

const createBasket = (data,backendApp) => {
    // const Product = backendApp.mongoose.model('Basket');
    return new Promise((rs,rj)=>{
        // Product.create(data,(e,r)=>{
        //     if (e) return rj(e);
        //     if (!r) return rj("One of Basket is invalid!");
        //     if (r) return rs(r)
        // });
        setTimeout (()=>{
            data['_id'] = Math.random();
            rs(data)
        },100)

    })
};
const parseToIdArr = arr => {
    let arrRes = [];
    arr.map(obj=>{
        arrRes.push(obj._id)
    });
    return arrRes;
};