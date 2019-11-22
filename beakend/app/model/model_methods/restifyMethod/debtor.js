
module.exports.postUpdate = async (req, res, next, backendApp) => {
    let debtor = req.erm.result;
     if (req.user.role === 'provider' || req.user.role === 'collaborator') {
         sendToClient(backendApp, debtor, req);
         next()
    } else { next() }
};

const sendToClient = (backendApp, data, req) => {
    backendApp.events.callWS.emit('message', JSON.stringify({
        event:"debtor-confirm",
        data: {data:data},
        to: data.clientOwner
    }));
};
