//var validator = require('validator');
//var async = require('async');

(function(){
    var Promise = require('bluebird');

    module.exports = {

        /**
         * Return the app page
         */
        index: function (req, res){
            return res.ok({
                routes: sails.config.app.routes
            }, 'app/app');
        },

        signin: function (req, res) {
            var strategies = sails.config.passport;
            var providers  = {};

            // Get a list of available providers for use in your templates.
            Object.keys(strategies).forEach(function (key) {
                if (key === 'local') {
                    return;
                }
                providers[key] = {
                    name: strategies[key].name,
                    token: key
                };
            });

            // Render the `auth/login.ext` view
            res.ok({
                title:  ViewsService.buildTitle(req.__('i18n_Login')),
                layout: 'auth/layout-auth',
                errors    : req.flash('error'),
                successes : req.flash('success'),
                copy: sails.config.app.copy,
                providers: providers,
                routes: sails.config.app.routes
            }, 'auth/login');
        },

        signup: function (req, res) {
            res.ok({
                title: ViewsService.buildTitle(req.__('i18n_Register')),
                layout: 'auth/layout-auth',
                errors: req.flash('error'),
                copy: sails.config.app.copy,
                routes: sails.config.app.routes
            }, 'auth/register');
        },

        flash: function(req, res){
            return res.ok({
                errors    : req.flash('error'),
                success : req.flash('success'),
                warnings  : req.flash('warning'),
                info: req.flash('info')
            });
        },

        /**
         * Return the settings of application to be used with ajax call.
         */
        configurationJSON: function(req, res){
            res.ok( WebAppService.generateConfiguration() );
        },

        /**
         * Return the configuration as .js.
         * Just include this route as a script.
         * @param req
         * @param res
         */
        configurationJS: function(req, res){
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', 0);
            res.send('window.APP_CONFIG = ' + JSON.stringify( WebAppService.generateConfiguration() ) + ';');
        },

        pipeCOR: function (req, res) {

            if(sails.config.environment === 'production'){
                console.error('You must disable this route for production');
            }
            var content = null;

            //request(req.param('url'), function(err, resp, body) {
            //	console.log(body);
            //	content = body;
            //	pass back the results to client side
            //	res.send(content);
            //});
            require('request').get(req.param('url')).pipe(res);

        },

    };

})();
