const imageToSlices = require('image-to-slices');
const path = require('path');
imageToSlices.configure({
    clipperOptions: {
        canvas: require('canvas')
    }
});
module.exports = (backendApp, router) => {
    router.post('/imgSlice', [], (req,res,next) => {
        let fileName = req.body.fileName;
        req.body.xx.forEach((it,ind)=>{
            req.body.xx[ind] = parseInt(it);
           if (req.body.xx[ind] < 1) req.body.xx[ind] = 1
        });
        req.body.yy.forEach((it,ind)=>{
            req.body.yy[ind] = parseInt(it);
            if (req.body.yy[ind] < 1) req.body.yy[ind] = 1
        });

        imageToSlices(path.join(__dirname, '../../../../upload/'+fileName),
            req.body.xx, req.body.yy,
            {
                saveToDataUrl: true
            }, (v) => {
                minification(fileName, v[4].dataURI, (err,info)=>{
                    res.ok('ok')
                })
            }
        );
    });
};
const sharp = require('sharp');

const minification = (fileName, base64Data, next)=>{
    base64Data = base64Data.toString().split("base64,")[1];
    base64Data = convertation(base64Data);

    sharp(base64Data)
            .resize(126)
            .toFile('upload/product/'+fileName, (err, info) => {next(err,info)} );
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