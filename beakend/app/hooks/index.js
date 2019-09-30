const glob = require('glob');
const path = require('path');

module.exports = function (backendApp, config) {
    let middlewares = {};
    let middlewaFunctions = glob.sync(backendApp.config.root + '/hooks/**/*.js');

    middlewaFunctions.forEach(function (middlewarePath) {
        const middlewareFileInfo = path.parse(middlewarePath);
        middlewares[middlewareFileInfo.name] = require(middlewarePath);
    });
    return middlewares;
};
