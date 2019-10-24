const imageToSlices = require('image-to-slices');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

module.exports = (backendApp, router) => {
    router.post('/imgSlice/:dir?', [], (req,res,next) => {
        const fileName = req.body.fileName;
        const x = req.body.xx;
        const y = req.body.yy;
        const dir = req.params.dir ? req.params.dir+'/' : '';
        let readableStream = fs.createReadStream('upload/'+fileName);
        let writableStream = fs.createWriteStream('upload/'+ dir + fileName);
        const left= parseInt(x[0]);
        const top= parseInt(y[0]);
        const width= parseInt(x[1]);
        const height= parseInt(y[1]);
        try {
            const transformer =  sharp()
                .extract({ left: left, top: top, width: width, height: height })
                .resize(200);

            readableStream
                .pipe(transformer)
                .pipe(writableStream).on('finish', ()=>{
                res.ok({file:fileName})
            });
        } catch(e) {
            res.notFound("Error!")
        }

    });
};

//
// const minification = (fileName, base64Data, dir='product', next)=>{
//     base64Data = base64Data.toString().split("base64,")[1];
//     base64Data = convertation(base64Data);
//
//     sharp(base64Data)
//             .resize(126)
//             .toFile('upload/'+dir+'/'+fileName, (err, info) => {next(err,info)} );
// };
// const convertation = b64string =>{
//     let buf;
//     if (typeof Buffer.from === "function") {
//         buf = Buffer.from(b64string, 'base64'); // Ta-da
//     } else {
//         buf = new Buffer(b64string, 'base64'); // Ta-da
//     }
//     return buf;
// };