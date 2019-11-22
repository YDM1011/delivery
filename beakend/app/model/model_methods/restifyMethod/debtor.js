
module.exports.postUpdate = async (req, res, next, backendApp) => {
    let debtor = req.erm.result;
    backendApp.mongoose.model('Debtor')
        .findOne({_id: debtor._id})
        .populate({path:"basket", select:"basketId"})
        .exec((e,r)=>{
            if (e) return res.serverError(e);
            if (!r) return res.notFound("not found");
            if (req.user.role === 'provider' || req.user.role === 'collaborator') {
                sendToClient(backendApp, r, req);
                next()
            } else { next() }
        })

};

const sendToClient = (backendApp, data, req) => {
    backendApp.events.callWS.emit('message', JSON.stringify({
        event:"debtor-confirm",
        data: {data:data},
        to: data.clientOwner
    }));
};
