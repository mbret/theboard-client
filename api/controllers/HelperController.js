//var validator = require('validator');
//var async = require('async');

(function(){

    module.exports = {

        /**
         * Return all the flash message available on the server.
         * It's used by the web app.
         * @param req
         * @param res
         * @returns {*}
         */
        flash: function(req, res){
            return res.ok({
                errors    : req.flash('error'),
                success : req.flash('success'),
                warnings  : req.flash('warning'),
                info: req.flash('info')
            });
        },

        /**
         * Return the configuration as .js.
         * Just include this route as a script.
         * @param req
         * @param res
         */
        configuration: function(req, res){
            // @todo handle .json endpoint
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', 0);
            res.send('window.APP_CONFIG = ' + JSON.stringify( ViewsService.generateConfiguration() ) + ';');
        },

        pipeCOR: function (req, res) {

            if(sails.config.environment === 'production'){
                console.error('You must disable this route for production');
            }

            require('request').get(req.param('url')).pipe(res);

        },
    };

})();
