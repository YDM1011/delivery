const md5 = require('md5');
const jwt = require('jsonwebtoken');
module.exports = (backendApp, router) => {

    const postSignup = (req, res, next) => {
        const signup = new backendApp.hooks.signupRole(req, res, null, backendApp);
        signup.confirmSmsCode()
    };

    router.post('/confirmAuth', [], postSignup);
};

