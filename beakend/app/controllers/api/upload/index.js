const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = (backendApp, router) => {
    router.post('/upload', [], function (req, res, next) {
        let form = new IncomingForm();
        let readStream, createStream, fileName;
        let transform = sharp().resize(400);
        form.on('file', (field, file) => {
            readStream = fs.createReadStream(file.path);
            fileName = new Date().getTime() + '--' + file.name;
            createStream = fs.createWriteStream(path.join(__dirname, '../../../../upload/'+fileName));
            readStream.pipe(transform).pipe(createStream);
        });
        form.on('end', (e) => {
            res.ok({file: fileName});
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
