const path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    app: {
        name: 'Smart'
    },
    port: process.env.PORT || 8000,
    WSport: process.env.WS || 6760,
    db: 'mongodb://localhost:27017/smart',
    jwtSecret: process.env.JWTSECRET || "secret",
    email: {
        host: "smtp.mail.yahoo.com",
        port: 465,
        secure: true,
        user: "ydm101194@yahoo.com",
        message: "Hello from Smart",
        subject: "Smart",
        pass: "adn45hrf"
    },
    site: {
        sidDomain: "185.69.153.199",
        domain: "http://185.69.153.199",
        innerDomain: "http://185.69.153.199",
        baseUrl: "http://185.69.153.199",
        resetPasswordUrl: "/reset_password/",
        setPasswordUrl: "/reset_password/"
    },
    defaultLanguage: "en",
    linkSecretKey: "secretKey",
    rootSecret: "xGCIjhiR4Patsdfasdjrehgkejrg"
};
