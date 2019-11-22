const imageToSlices = require('image-to-slices');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

module.exports = (backendApp, router) => {
    router.post('/liqpay/callback', [], (req,res,next) => {
        backendApp.service.liqpay.checkCallback().then(v=>{
            res.ok(v)
        })
    });
    router.get('/liqpay', [], (req,res,next) => {
        backendApp.service.liqpay.getBtnPay(req.user, backendApp).then(v=>{
            res.ok({btn:v})
        })
    })
};