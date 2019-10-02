const path = require('path'),
      rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  root: rootPath,
  app: {
    name: 'Laundrwise'
  },
  port: process.env.PORT || 3000,
  WSport: process.env.WS || 6760,
  db: 'mongodb://localhost:27017',
  jwtSecret: process.env.JWTSECRET || "secret",
  email: {
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      user: "ydm101194@yahoo.com",
      message: "Hello from Tasteol",
      subject: "Laundrwise",
      pass: "adn45hrf"
  },
  site: {
    sidDomain: "localhost",
        domain: "http://localhost:3001",
    innerDomain: "http://localhost:3001",
    baseUrl: "http://localhost:4200",
    resetPasswordUrl: "/reset_password/",
    setPasswordUrl: "/reset_password/"
  },
  defaultLanguage: "en",
  linkSecretKey: "secretKey",
  rootSecret: "xGCIjhiR4Patsdfasdjrehgkejrg"
};
