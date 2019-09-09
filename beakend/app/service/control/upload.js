// const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const path = require('path');

module.exports = (req, backendApp) => {
    const reqFile = req.body.body;
    return new Promise((rs,rj)=>{
        let readStream, createStream, fileName;
        readStream = fs.createReadStream(reqFile.path);
        fileName = new Date().getTime() + '--' + reqFile.name;
        createStream = fs.createWriteStream(path.join(__dirname, '../../../../upload/'+fileName));
        readStream.pipe(createStream);
    });
};