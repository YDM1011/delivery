module.exports = function (backendApp, router) {

    router.get('/hashLink', [], async function (req, res, next) {
        res.ok(backendApp.service.authlink.getHash({login:"admin1",pass:"123"}))

    });
    router.get('/hashLink/:token', [], async function (req, res, next) {
        backendApp.service.authlink.parseHash(
            req.params.token,
            {login:"",pass:""}, req).then(v => {
            v.signin(req,res,backendApp)
            // res.ok(req.user)
        })

    });
};