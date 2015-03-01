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
        
        function(cb){
            
            if( sails.config.fillDb === true ){
                DbService.initDev()
                    .then(function(){
                        cb();
                    })
                    .catch(cb);
            }
            else{
                return cb();
            }
        }
        
    ], function(error){
        return cb(error);
    });
};
