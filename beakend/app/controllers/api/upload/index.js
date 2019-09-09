const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const path = require('path');

module.exports = (backendApp, router) => {
    router.post('/upload', [], function (req, res, next) {
        let form = new IncomingForm();
        form.on('file', (field, file) => {
            res.ok(file);
        });
        form.parse(req);
    });
    /** test
    router.post('/upload2', [], function (req, res, next) {
        backendApp.service.upload(req.body.body, backendApp).then(v=>{
            res.ok(v)
        })
    });
    */
};
