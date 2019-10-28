const WebSocketServer = require('ws').Server;
const wsEvent = {};
const wss = new WebSocketServer({ port: backendApp.config.WSport, path: '/ws' });
const glob = require('glob');
const wsControllers = glob.sync(backendApp.config.root+'/service/wsEvents/*.js');

wsControllers.forEach((controller) => {
    let wsController = require(controller)();
    wsEvent[wsController.event] = wsController.fun;
});

module.exports = (backendApp, socket = null, data = null) => {

    wss.on('connection', (ws, req) => {
        let userData;
        backendApp.events.callWS.on('message', async (event)=>{
            const data = JSON.parse(event);
            if (data.event !== 'connect') {
                try {
                    messageSend(JSON.stringify(event), wss, ws)
                } catch (e) {
                    return
                }
            }
        });

        ws.on('message', async (event) => {
            const data = JSON.parse(JSON.parse(event));
            if (data.event === 'connect'){
                // let tokenData =  parseAuthorization(req.headers.authorization);

                // if (!tokenData) tokenData =  parseAA(req.headers.authorization);
                if (data.token){
                    userData = await checkToken(backendApp, {token:data.token, model: 'Client'}).catch(e=>{console.error(e)});
                    if(!userData) {
                        userData = await checkToken(backendApp, {token:data.token, model: 'Admin'}).catch(e=>{console.error(e)});
                    }
                    if (userData) saveConnect(userData, wss, ws);

                }
            } else {
                // userData = await checkToken(backendApp, {token:data.token, model: 'Client'}).catch(e=>{console.error(e)});
                // if(!userData) {
                //     userData = await checkToken(backendApp, {token:data.token, model: 'Admin'}).catch(e=>{console.error(e)});
                // }
                messageSend(event, wss, ws)
            }
        });

        backendApp.events.callWS.on('close',(userId = null)=>{
            removeConnect(userId || ws.userId, wss);
            console.log('disconnected',ws.userId);
        });
        ws.on('close', () => {
            console.log('disconnected',ws.userId, ws.index);
            removeConnect(ws.userId, wss, ws.index);
        });

    });

};

const checkToken = (backendApp,tokenData) => {
    const jwt = require('jsonwebtoken');
    const Schema = backendApp.mongoose.model(tokenData.model);
    return new Promise((rs,rj)=>{
        jwt.verify(tokenData.token, backendApp.config.jwtSecret, (err,data)=>{
            if (err) {
                return rj("Token error");
            } else {
                console.log(data);
                Schema.findOne({login: data.login})
                    .exec((err, info)=>{
                        if (err) return rj(err);
                        if (!info){
                           rj("not found")
                        } else {
                            rs(info)
                        }
                    });
            }
        });
    });
};
const removeConnect = (userId, wss, index = null) => {
    if (!wss[userId]) return;

    if (index) {
        const isLargeNumber = element => {
            return element.index == index;
        };
        wss[userId].splice(wss[userId].findIndex(isLargeNumber), 1);
    } else {
        delete wss[userId];
    }
};
/**
 * wss->userId->[ws<index, socket>]
 * @param userData
 * @param wss
 * @param ws
 */
const saveConnect = (userData, wss, ws) => {
    if (wss[userData._id]){
        /** update */
        delete wss[userData._id];
        wss[userData._id] = [];
        ws['userId'] = userData._id;
        wss[userData._id].push(ws);
    } else {
        /** create */
        delete wss[userData._id];
        wss[userData._id] = [];
        ws['userId'] = userData._id;
        wss[userData._id].push(ws);

    }
    /** logger connects **/
    console.log("save as",wss[userData._id].length, userData._id);
    wss[userData._id].forEach((i,it)=>{
        console.log("saveds", i.userId, userData._id)
    })
};

const messageSend = (event, wss, client) => {
    const data = JSON.parse(event);
    const res = JSON.parse(data);

    const sendTo = (to, event, data) => {
        // if (!userData) {
        //     client.send(JSON.stringify({
        //         event: event,
        //         data: "ok!!"
        //     }))
        // }
        if (!to) {
            // wss[userData._id].forEach(ws=>{
            //     ws.send(JSON.stringify({
            //         event: event,
            //         data: "ok!!"
            //     }));
            // });
            return
        }
        /** All user's requests and send response to 1 client of all requests */
        wss[to] ? wss[to].forEach(ws=>{
            console.log("Sender",to)
            ws.send(JSON.stringify({
                event: event,
                data: res.data
            }));
        }) : '';
        //
        // wss.clients.forEach(ws=>{
        //     ws.send(JSON.stringify({
        //         event: event,
        //         data: data
        //     }));
        // });
    };
    const send = (event, data) => {
        if (res.to == 'admin'){
            backendApp.mongoose.model('Admin').findOne({}).exec((e,r)=>{
                if (r) {
                    sendTo(r._id, event, data);
                }
            })
        } else {
            sendTo(res.to, event, data);
        }
    };
    wsEvent[res.event](data, send);
};
Object.size = obj => {
    let size = 0, key;
    for (key in obj) {
        console.log(obj.hasOwnProperty(key), key);
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
