/***********************************/

const express = require('express');
const config = require('./app/config/config');
const glob = require('glob');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

if (config.dbConnect) {
    mongoose.connect(config.db); //{ useNewUrlParser: true }
} else {
    mongoose.connect(config.db, { useNewUrlParser: true }); //
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
}
const db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
});

let models = glob.sync('./app/model/*.js');

models.forEach(function (model) {
    if (model.indexOf('model_methods') > -1)
        return;
    require(model);
});


// startCron();
/*********************/
let app = express();

module.exports = require('./app/config/express')(app, config);

/********************************/

