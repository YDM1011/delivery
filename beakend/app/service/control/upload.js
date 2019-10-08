// const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = (body, backendApp) => {
    const reqFile = body;
    console.log(reqFile);
    return new Promise((rs,rj)=>{
        let readStream, createStream, fileName;
        readStream = fs.createReadStream(reqFile.path);
        fileName = new Date().getTime() + '--' + reqFile.name;
        createStream = fs.createWriteStream(path.join(__dirname, '../../../upload/'+fileName));

        const roundedCornerResizer =
            sharp()
                .resize(200)
                .png();

        readStream
            .pipe(roundedCornerResizer)
            .pipe(createStream);

        readStream.on('end', ()=>{
            rs(fileName)

        })
    });
};
