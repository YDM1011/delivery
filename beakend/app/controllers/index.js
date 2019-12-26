const glob = require('glob');
const cors = require('cors');

module.exports = function (backendApp) {

  let apiControllers = glob.sync(backendApp.config.root+'/controllers/api/**/*.js');


  const originsWhitelist = [
      '*'
  ];
  const corsOptions = {
      origin:originsWhitelist,
      credentials:true
  };

  backendApp.app.use('/api', cors(corsOptions));

  const apiRouter = backendApp.express.Router();
  const Router = require("../../routes");

  backendApp.app.use('/api', apiRouter);
  backendApp.app.use('/', Router);

  apiControllers.forEach((controller) => {
    require(controller)(backendApp, apiRouter);
  });
};
