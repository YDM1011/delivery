const express = require('express');
const glob = require('glob');
const fs = require('fs');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const jwt = require('jwt-express');
const flash = require('connect-flash');
const path = require('path');
// const cons = require('consolidate');

const init = (app, config) =>{

    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb', "strict": false,}));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
    app.use(cookieParser());
    app.use(compress());
    app.use(flash());
    app.use('/upload', express.static(path.join(__dirname, '../../upload')));
    app.use('/', express.static(config.root + 'public'));

    app.use(methodOverride());
    app.use(function (req, res, next) {
        if (req.query.accessToken) {
            req.headers.authorization = "Bearer " + req.query.accessToken;
        }
        next();
    });
    app.use(jwt.init(config.jwtSecret, {
        cookies: true
    }));
    // app.set('subdomain offset', 1);

    app.use(function (req, res, next) {
        /** Params for cookie auth form angular 7 */
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', req.headers.origin || config.site.domain || '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookies, Cookie, Content-Length, PortalRequest, X-Requested-With');
        //intercepts OPTIONS method
        if ('OPTIONS' === req.method) {
            res.send();
        } else {
            next();
        }
    });
    app.use(require("../../app/responces"));
    const EventEmitter = require('events');
    class Emitter extends EventEmitter {}
    let backendApp = {
        app: app,
        config: config,
        mongoose: mongoose,
        express: express,
        service: {},
        events: {
            callWS: new Emitter()
        }
    };
    global.backendApp = backendApp;
    backendApp.middlewares = require('../middlewares')(backendApp, config);
    backendApp.hooks = require('../hooks')(backendApp, config);
    // new backendApp.hooks.transfer();
    backendApp.customEndPoints = [];
    require('../controllers')(backendApp);
    require('../service')(backendApp);
    require('./mongooseRestApi')(backendApp);


    app.set('views', path.join(__dirname, '../../../beakend/views'));
    app.set('view engine', 'ejs');

    app.use('/', express.static(path.join(__dirname, '../../../aplication/dist/application')));
    app.use('/', express.static(path.join(__dirname, '../../../admin/dist/admin')));
    app.use('/', express.static(path.join(__dirname, '../../../provider/dist/provider')));

    app.get("/", (req, res, next) => {
        const host = req.hostname;
        switch (host.split('.')[0]) {
            case 'client':
                res.status(200);
                res.render('client');
                break;
            case 'admin':
                res.status(200);
                res.render('admin');
                break;
            case 'provider':
                res.status(200);
                res.render('provider');
                break;
            default:
                res.status(200);
                res.render('client');
                break;
        }
    });

// catch 404 and forward to error handler
    app.use((req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // console.log('subdomains',req.subdomains);
        // if (req.subdomains.length === 0 && err.status === 404) {
        //     res.status(200);
        //     res.render('index');
        //     return
        // }
        if(err.status == 404) {
            const host = req.hostname;
            switch (host.split('.')[0]) {
                case 'client':
                    res.status(200);
                    res.render('client');
                    break;
                case 'admin':
                    res.status(200);
                    res.render('admin');
                    break;
                case 'provider':
                    res.status(200);
                    res.render('provider');
                    break;
                default:
                    res.status(200);
                    res.render('client');
                    break;
            }
        } else {
            res.status(err.status || 500);
            res.render('index');
        }
        // render the error page


    });

    return app;
};


module.exports = init;
