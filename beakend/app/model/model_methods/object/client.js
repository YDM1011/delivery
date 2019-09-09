module.exports = function (schema) {

  schema.methods.signin = function (req,res,backendApp) {
      res.cookie('token',this.token,
          {
              domain: backendApp.config.site.sidDomain,
              path:"/",
              httpOnly: true
          });
      res.cookie('userId', String(this._id),
          {
              domain: backendApp.config.site.sidDomain,
              path:"/",
              httpOnly: false
          });
      res.cookie('adminToken',this.token,
          {
              domain: backendApp.config.site.sidDomain,
              path:"/",
              expires: new Date(-1),
              httpOnly: true
          });
      res.cookie('adminId', String(this._id),
          {
              domain: backendApp.config.site.sidDomain,
              path:"/",
              expires: new Date(-1),
              httpOnly: false
          });
      res.ok({token:this.token,userId:this._id, user: this.toObject()})
  };
  schema.methods.logout = function (req,res) {
      res.cookie('token',this.token,
          {
              domain: backendApp.config.site.sidDomain,
              path:"/",
              expires: new Date(-1),
              httpOnly: true
          });
      res.cookie('userId', String(this._id),
          {
              domain: backendApp.config.site.sidDomain,
              path:"/",
              expires: new Date(-1),
              httpOnly: false
          });
      res.ok({mes:'ok'})
  };
};
