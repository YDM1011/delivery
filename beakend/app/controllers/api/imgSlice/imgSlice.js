const imageToSlices = require('image-to-slices');
const path = require('path');
imageToSlices.configure({
    clipperOptions: {
        canvas: require('canvas')
    }
});
module.exports = (backendApp, router) => {

    router.post('/imgSlice', [], (req,res,next) => {
        const dir = '../../../../upload/';
        console.log("Start");
        let fileName = req.body.fileName;
        console.log(path.join(__dirname, '../../../../upload/'+fileName));

        imageToSlices(path.join(__dirname, '../../../../upload/'+fileName), req.body.xx, req.body.yy,
            {
                // saveToDir: path.join(__dirname, '../../../../upload/')
                saveToDataUrl: true
            }, (v) => {
                console.log('the source image has been sliced into 9 sections!');
                // v[4].dataURI = convertation(v[4].dataURI.toString().split("base64,", ""));
                //
                // console.log(v[4].dataURI)
                minification(fileName, v[4].dataURI, (err,info)=>{
                    console.log(err,info);
                    res.ok('ok')
                })
            }
        );
    });
};
const sharp = require('sharp');

const minification = (fileName, base64Data, next)=>{
    base64Data = base64Data.toString().split("base64,")[1];
    console.log("TEST",base64Data)
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