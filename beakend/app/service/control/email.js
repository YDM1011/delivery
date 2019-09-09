const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

module.exports = (objHtml, backendApp) => {
    console.log(objHtml);
    let template;
    const transporter = nodemailer.createTransport(
        {
            host: backendApp.config.email.host,
            port: backendApp.config.email.port,
            secure: backendApp.config.email.secure,
            auth: {
                user: backendApp.config.email.user,
                pass: backendApp.config.email.pass
            }
        });
    template = path.join(__dirname, `../../../views/emailTemplate/${objHtml.temp}.ejs`);
    if (template) return sender (transporter, backendApp.config, objHtml, template);

};

const sender = (tr, data, obj, template)=>{
    tr.sendMail({
        from: data.email.user,
        to: obj.to,
        subject: obj.subject ? obj.subject : data.email.subject,
        html: ejs.render( fs.readFileSync(template, 'utf-8') , {data: obj.tempObj})
    }, (err, info) => {
        if (err) {
            return console.log(err);
        }

    });
};
