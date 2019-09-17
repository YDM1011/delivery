const mongoose = require('mongoose');

module.exports = function (req, res, next) {
  const model = mongoose.model(req.erm.model.modelName);
  const id = req.params.id;
    /**
     * find by id and one of check
     * 1 is admin1
     * 2 owner client
     * 3 in future is in role field
     */
    if (req.isAdmin) return next();

    model.findOne({
        _id:id,
        createdBy: req.user._id
    }).exec((err,r)=>{
        if (err) return res.serverError(err);
        if (!r) return res.forbidden("Forbidden");
        if (r) return next();
    })
};
