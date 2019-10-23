const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = (backendApp, router) => {
    router.post('/upload', [], function (req, res, next) {
        let form = new IncomingForm();
        let readStream, createStream, fileName;
        const transformer =  sharp()
            .resize(500);
        form.on('file', (field, file) => {
            readStream = fs.createReadStream(file.path);
            fileName = new Date().getTime() + '--' + file.name;
            createStream = fs.createWriteStream(path.join(__dirname, '../../../../upload/'+fileName));
            readStream.pipe(transformer).pipe(createStream).on('finish', ()=>{
                res.ok({file:fileName})
            });
        });
        form.on('end', (e) => {
            // let readableStream = fs.createReadStream('upload/'+fileName);
            // let writableStream = fs.createWriteStream('upload/'+fileName);
            // const transformer =  sharp()
            //     .resize(500);
            // readableStream
            //     .pipe(transformer)
            //     .pipe(writableStream).on('finish', ()=>{
            //     res.ok({file:fileName})
            // });
            // res.ok({file:fileName})
        });
        form.parse(req);

    });

    router.post('/deleteFile', [], function (req, res, next) {
        const mainName = req.body.file;
        fs.unlink("upload/"+mainName, fsCallbeack=>{
            fs.unlink("upload/address/"+mainName, fsCallbeack=>{
                fs.unlink("upload/avatar/"+mainName, fsCallbeack=>{
                    fs.unlink("upload/product/"+mainName, fsCallbeack=>{
                        res.ok({file: mainName});
                    });
                });
            });
        });
    });

};
