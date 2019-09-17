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

    wss.on('connection', async (ws, req) => {
        console.log("authorization",req.headers.authorization)
        let tokenData =  parseAuthorization(req.headers.authorization);
        let userData;
        if (!tokenData) tokenData =  parseAA(req.headers.authorization);
        if (tokenData){
            userData = await checkToken(backendApp, tokenData).catch(e=>{console.error(e)});
            saveConnect(userData, wss, ws);
        }

        backendApp.events.callWS.on('message',(event)=>{
            // ws.send(JSON.stringify(event))
            try {
                console.log(event, userData)
                messageSend(JSON.stringify(event), userData, wss, ws)
            } catch (e) {return}

        });

        ws.on('message', (event) => {
            messageSend(event, userData, wss, ws)
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

const parseAuthorization = (str) => {
    if (!str) return;
    // let tokenName = findTokenName(str);
    // let token = str.split(tokenName+'=')[1].split(';')[0];
    const token = str.split(" ");
    const tokenName = str;
    return {name:tokenName, token:token, model: 'Client'}
};
const parseAA = (str) => {
    if (!str) return;
    // let tokenName = findTokenName(str);
    // let token = str.split(tokenName+'=')[1].split(';')[0];
    const token = str.split(" ");
    const tokenName = str;
    return {name:tokenName, token:token, model: 'Admin'}
};

const findTokenName = (str) => {
    if (str && (str.search('adminToken') > -1)) return 'adminToken';
    if (str && (str.search('token') > -1)) return 'token';
    return null
};

const checkToken = (backendApp,tokenData) => {
    const jwt = require('jsonwebtoken');
    const Schema = backendApp.mongoose.model(tokenData.model);
    return new Promise((rs,rj)=>{
        jwt.verify(tokenData.token, backendApp.config.jwtSecret, (err,data)=>{
            if (err) {
                return rj("Token error");
            } else {
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
    ws['userId'] = userData._id;
    let connectsItem = wss[userData._id];
    console.log(typeof connectsItem);
    if (connectsItem){
        /** update */
        let lastIndex = connectsItem.length - 1;
        if(!connectsItem[lastIndex]){
            delete wss[userData._id];
            wss[userData._id] = [];
            ws['index'] = wss[userData._id].length + 1;
            wss[userData._id].push(ws);
            console.log("break dont save", ws['index'])
            return
        }
        ws['index'] = (connectsItem[lastIndex].index || lastIndex) + 1;
        connectsItem.push(ws);
    } else {
        /** create */
        delete wss[userData._id];
        wss[userData._id] = [];
        ws['index'] = wss[userData._id].length + 1;
        wss[userData._id].push(ws);

    }
    /** logger connects **/
    console.log("save as",ws['index']);
    wss[userData._id].forEach((i,it)=>{
        console.log("saveds", i.index)
    })
};

const messageSend = (event, userData, wss, client) => {
    console.log("data",event, userData)
    const data = JSON.parse(event);
    const res = JSON.parse(data);

    const sendTo = (to, event, data) => {
        if (!userData) {
            client.send(JSON.stringify({
                event: event,
                data: "ok!!"
            }))
        }
        if (!to) {
            wss[userData._id].forEach(ws=>{
                ws.send(JSON.stringify({
                    event: event,
                    data: "ok!!"
                }));
            });
            return
        }
        /** All user's requests and send response to 1 client of all requests */
        wss[to] ? wss[to].forEach(ws=>{
            ws.send(JSON.stringify({
                event: event,
                data: data
            }));
        }) : '';
    };
    const send = (event, data) => {
        if (res.to == 'admin1'){
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
