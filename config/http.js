var passport = require('passport');
var express = require('express');

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
       'passport',
       'myRequestLogger',
       'bodyParser',
       'handleBodyParserError',
       'compress',
       'methodOverride',
       'poweredBy',
       // own middleware start
       'staticData',
       '$custom',   // backward compatibilities
       'custom',    // app middleware
       // own middleware end
       'router',
       'www',
       'favicon',
       '404',
       '500'
    ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    // Add the /data folder to the static asset
    // This path is used to serve content that come from users (this content is not inside assets folder)
    staticData: express.static(__dirname + '/../data/statics', {
        // here is possible options for the static path
    }),

    /**
    * Custom middleware that do some job.
    * @param req
    * @param res
    * @param next
    */
    custom: function(req, res, next){
        // Auto log user if asked
        if(sails.config.autoLogin && !req.isAuthenticated()){
            User.findOne({email:'user@gmail.com'}, function(err, user){
                if(err){
                    return next(err);
                }
                req.login(user, function (err) {
                    if (err){
                        return next(err);
                    }
                    sails.log.debug('User autologged by middleware!');
                });
            });
        }
        return next();
    },

    //Passport middleware
    passport: function (req, res, next) {
      // Initialize Passport
      passport.initialize()(req, res, function () {
        // Use the built-in sessions
        passport.session()(req, res, function () {
          // Make the user available throughout the frontend
          res.locals.user = req.user;
          //sails.log.debug('Passport middleware');
          return next();
        });
      });
    }

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }


  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  ***************************************************************************/

    // bodyParser: require('skipper')

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

  // cache: 31557600000
};
