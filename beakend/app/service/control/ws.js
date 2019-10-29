const WebSocketServer = require('ws');
const wsEvent = {};
const wss = new WebSocketServer.Server({ port: backendApp.config.WSport, path: '/ws' });
const glob = require('glob');
const wsControllers = glob.sync(backendApp.config.root+'/service/wsEvents/*.js');
let WSDB = {};
wsControllers.forEach((controller) => {
    let wsController = require(controller)();
    wsEvent[wsController.event] = wsController.fun;
});

module.exports = (backendApp, socket = null, data = null) => {
    backendApp.events.callWS.on('message', async (event)=>{
        const data = JSON.parse(event);
        if (data.event !== 'connect') {
            try {
                console.log(Object.size(WSDB))
                messageSend(JSON.stringify(event), WSDB)
            } catch (e) {
                return
            }
        }
    });
    backendApp.events.callWS.on('close',(userId = null)=>{
        delete WSDB[String(userId)]
    });
    wss.on('connection', (ws) => {
        let userData;
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
                    ws['userId'] = userData.id;
                    // delete WSDB[String(userData.id)]
                    WSDB[String(userData.id)] = ws;
                    // if (userData) saveConnect(userData, glob.WSDB, ws);
                }
            } else {
                // userData = await checkToken(backendApp, {token:data.token, model: 'Client'}).catch(e=>{console.error(e)});
                // if(!userData) {
                //     userData = await checkToken(backendApp, {token:data.token, model: 'Admin'}).catch(e=>{console.error(e)});
                // }
                // messageSend(event, WSDB)
            }
        });

        ws.on('close', () => {
            console.log('disconnected', ws.userId);
            // removeConnect(ws.userId, glob.WSDB, ws.index);
            delete WSDB[ws.userId]
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
const removeConnect = (userId, WSDB, index = null) => {
    userId = String(userId);
    delete glob.WSDB[userId];
    console.log("del exit",glob.WSDB[userId])

    if (index) {
        const isLargeNumber = element => {
            return element.index == index;
        };
        glob.WSDB[userId].splice(glob.WSDB[userId].findIndex(isLargeNumber), 1);
    } else {
        delete glob.WSDB[userId];
        console.log("del exit",glob.WSDB[userId])
    }
};
/**
 * wss->userId->[ws<index, socket>]
 * @param userData
 * @param wss
 * @param ws
 */
const saveConnect = (userData, WSDB, ws) => {
    ws['userId'] = String(userData._id);
};

const messageSend = (event, WSDB) => {
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
        // WSDB[to].forEach(ws=>{
        //     console.log("Sender",to)
        //     ws.send(JSON.stringify({
        //         event: event,
        //         data: res.data
        //     }));
        // });

        WSDB[to].send(JSON.stringify({
            event: event,
            data: res.data
        }));

        // wss.clients.forEach(client=>{
        //     let triger;
        //     if (client == ws && !triger) {
        //         ws.send(JSON.stringify({
        //             event: event,
        //             data: res.data
        //         }));
        //         triger = true;
        //         console.log("Deleted!!!")
        //     } else {
        //
        //     }
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
