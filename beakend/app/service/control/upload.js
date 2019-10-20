// const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = (body, backendApp) => {
    return new Promise((rs,rj)=>{
        const reqFile = body;
        let readStream, createStream, fileName;
        readStream = fs.createReadStream(reqFile.path);
        fileName = new Date().getTime() + '--' + reqFile.name;
        createStream = fs.createWriteStream(path.join(__dirname, '../../../upload/'+fileName));

        const roundedCornerResizer =
            sharp()
                .resize(500)
                .png();

        readStream
            .pipe(roundedCornerResizer)
            .pipe(createStream);

        readStream.on('end', ()=>{
            readStream.close();
            rs(fileName)
        })
    });
};
