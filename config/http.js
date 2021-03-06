var passport = require('passport');
var express = require('express');
var async = require('async');
var path = require('path');

/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */
module.exports.http = {

    /****************************************************************************
    *                                                                           *
    * Express middleware to use for every Sails request. To add custom          *
    * middleware to the mix, add a function to the middleware config object and *
    * add its key to the "order" array. The $custom key is reserved for         *
    * backwards-compatibility with Sails v0.9.x apps that use the               *
    * `customMiddleware` config option.                                         *
    *                                                                           *
    ****************************************************************************/

    middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP request. (the Sails *
    * router is invoked by the "router" middleware below.)                     *
    *                                                                          *
    ***************************************************************************/

        order: [
            'startRequestTimer',
            'cookieParser',
            'session',
            'myRequestLogger', // custom
            'passport',
            'passportSession',
            'bodyParser',
            'handleBodyParserError',
            'compress',
            'methodOverride',
            'poweredBy',
            // own middleware start
            'staticData',
            '$custom',   // backward compatibilities
            'attachViewLocals',
            // own middleware end
            'router',
            'www',
            'favicon',
            '404',
            '500'
        ],

        /**
         * Use this method to attach variables to view locals object
         * ex: res.locals.foo give <%= foo %>
         */
        attachViewLocals: function(req, res, next){
            return next();
        },

        // simple log of http request
        // Only in console, nginx take control on production environment
        myRequestLogger: function (req, res, next) {
            sails.log.info(req.method, req.url);
            return next();
        },

        // Add the /data folder to the static asset
        // This path is used to serve content that come from users (this content is not inside assets folder)
        staticData: express.static(__dirname + '/../data/statics', {
            index: false
        }),

        passport: require('passport').initialize(),

        // This module of passport is in charge of loading the user in session
        // the session only contain an id and is then completely loaded for app
        passportSession: function(req, res, next){
            passport.session()(req, res, function () {
                res.locals.user = req.user;
                return next();
            });
        },

        /***************************************************************************
        *                                                                          *
        * The body parser that will handle incoming multipart HTTP requests. By    *
        * default as of v0.10, Sails uses                                          *
        * [skipper](http://github.com/balderdashy/skipper). See                    *
        * http://www.senchalabs.org/connect/multipart.html for other options.      *
        *                                                                          *
        ***************************************************************************/

        //bodyParser: require('skipper')

    }

    /***************************************************************************
    *                                                                          *
    * The number of seconds to cache flat files on disk being served by        *
    * Express static middleware (by default, these files are in `.tmp/public`) *
    *                                                                          *
    * The HTTP static cache is only active in a 'production' environment,      *
    * since that's the only time Express will cache flat-files.                *
    *                                                                          *
    ***************************************************************************/

    //cache: 31557600000
};
