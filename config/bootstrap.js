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

    // Load passport providers on startup
    // Will add to passport.use() all the strategy
    sails.services.passport.loadStrategies();

    // Create data dir if it doesnt exist (with app rights)
    FileService.createDataDir(function(err){
        if(err){
            return next(err);
        }

        if( sails.config.environment === "development" ){
            DbService.initDev()
                .then(function(){
                    next();
                })
                .catch(next);
        }
        else{
            return next();
        }

        function next(err){
            return cb(err);
        }

    });
};
