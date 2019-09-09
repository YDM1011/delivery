module.exports = (req, backendApp) => {
    return new Promise((rs,rj)=>{
        const error = 'Role is invalid';
        const Client = backendApp.mongoose.model('Client');
        const action = (e,r) => {
            if (e) return rj(error);
            if (!r) return rj(error);
            if (r) return rs(r);
        };

        Client.findOne({_id:req.user._id, role:req.body.role}).exec(action);
    });
};