const webPush = require('web-push');
const config = require('../../../config/config');
const publicVapidKey = "BF5nS5fuWP8dDcwM-r2S8HTdeAMLWo5H-XqizujO79IAmg2d1cEtcDoeM4WfUbzs1NKoJwV_CuV7IG98Bq0z7Is";
const privateVapidKey = "txb5Q5mv3cQwTdLloRr3gxWSlr7OMDeLMaR4aBRP9wA";
webPush.setVapidDetails(`${config.site.domain}:${config.port}`, publicVapidKey, privateVapidKey);
module.exports = (backendApp, router) => {

    router.post('/notifications', (req, res) => {
        const subscription = req.body.notification;
        console.log(`Subscription received:`);
        console.log(subscription);
        res.status(201).json({});
        const payload = JSON.stringify({
            notification: {
                title: 'Notifications are cool',
                body: 'Know how to send notifications through Angular with this article!',
                icon: 'https://tasteol.com/1551827572395завантаження.jpg',
                vibrate: [100, 50, 100],
                data: {
                    url: 'https://medium.com/@arjenbrandenburgh/angulars-pwa-swpush-and-swupdate-15a7e5c154ac'
                }
            }
        });
        webPush.sendNotification(subscription, payload)
            .catch(error => console.error(error));

    });
};
