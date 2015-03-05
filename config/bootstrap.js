/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var Promise = require('bluebird');
var fs = require('fs');

module.exports.bootstrap = function(cb) {

    //sails.services.oauth2orize.createServer();

    // Load passport providers on startup
    // Will add to passport.use() all the strategy
    sails.services.passport.loadStrategies();

    async.series([

        // Create data dir if it doesnt exist (with app rights)
        function(cb){
            FileService.createDataDir(cb);
        },

        // Init database
        // For some dev reason we need to init and feel database sometimes
        function(cb){
            if( sails.config.fillDb === true ){
                switch(sails.config.environment){
                    case 'production':
                        DbService.init('production')
                        .then(function(){ cb(); })
                        .catch(cb);
                        break;
                    case 'development':
                        DbService.init('development')
                        .then(function(){ cb(); })
                        .catch(cb);
                        break;
                    default:
                        cb();
                }

            }
            else{
                return cb();
            }
        }

    ], function(error){
        return cb(error);
    });
};
