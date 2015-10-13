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
        //flash: function(req, res){
        //    return res.ok({
        //        errors    : req.flash('error'),
        //        success : req.flash('success'),
        //        warnings  : req.flash('warning'),
        //        info: req.flash('info')
        //    });
        //},

        /**
         * Return the configuration as .js.
         * Just include this route as a script.
         * @param req
         * @param res
         */
        configuration: function(req, res){
            return res.jsonView('APP_CONFIG', ViewsService.generateConfiguration());
        },

        pipeCOR: function (req, res) {
            if(sails.config.environment === 'production'){
                console.error('You must disable this route for production');
            }

            require('request').get(req.param('url')).pipe(res);
        },

        /**
         *
         * @param req
         * @param res
         */
        me: function(req, res){
            ApiService.user(req.user, function(err, response, body){
                if(err){ return res.serverError(err); }

                if(response.statusCode === 404){
                    req.logout();
                }

                if(response.statusCode !== 200){
                    return res.negociateApi(response);
                }
                return res.jsonView('USER', body);
            });
        }
    };

})();
