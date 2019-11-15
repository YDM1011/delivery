
module.exports = (backendApp, router) => {
    router.post('/saveToken', [backendApp.middlewares.isLoggedIn], async (req,res,next) => {
        let result = await backendApp.service.fcm.saveToken(req, backendApp).catch(e=> {return res.notFound(e)});
        if (result) {
            res.ok(result)
        } else {
            res.notFound('no user')
        }
    });
};