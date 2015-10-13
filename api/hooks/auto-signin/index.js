'use strict';

var path = require('path');

module.exports = function (sails) {

    return {

        defaults: {
            __configKey__: {
                active: true,
                injectBefore: 'bodyParser',
                credentials: null,
                middlewareName: 'auto-signin',
                login: function(){
                    throw new Error('Method login not overwrote. You have to specify one method to retrieve your user')
                }
            }
        },

        configure: function(){
            var config = sails.config[this.configKey];

            if(!config.active){
                return;
            }

            if(config.credentials === null){
                throw new Error('Please provide credentials')
            }

            // @todo check for existing midd func name
            if(false){
                throw new Error('A middleware with the name ' + config.middlewareName + ' already exist, please set another name in config');
            }

            var indexToPush = sails.config.http.middleware.order.indexOf(config.injectBefore);
            if(indexToPush === -1){
                throw new Error('Middleware ' + config.injectBefore + " doesn't seems to exist in the list of orders");
            }

            // inject middleware function
            sails.config.http.middleware.order.splice(indexToPush, 0, config.middlewareName);
            sails.config.http.middleware[config.middlewareName] = this._signin;
        },

        initialize: function (done) {

            // wait for http hook loaded
            // sails.config.http.middleware.order should contain our middleware
            sails.after('hook:http:loaded', function(){
                return done();
            });
        },

        /**
         * Auto log request
         * @param req
         * @param res
         * @param next
         */
        _signin: function(req, res, next){

            if(req.user){
                return next();
            }

            var config = sails.config[this.configKey];
            ApiService.login(config.credentials.email, config.credentials.password, function(err, response){

                if(err){
                    return next(new Error(err));
                }

                if(response.statusCode === 400){
                    sails.log.info('hook:auto-signin Invalid credentials provided, no action!');
                    return next();
                }

                if(response.statusCode !== 200){
                    return next(new Error('Credentials for signin hook seems incorrect. StatusCode : ' + response.statusCode));
                }

                req.login(response.body.user, function (err) {
                    if(err){
                        return next(err);
                    }
                    sails.log.info('auto-signin hook: User auto signed by hook!');
                    req.session.token = response.body.token;
                    return next();
                });
            });
        },

    };
};

