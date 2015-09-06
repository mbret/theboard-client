(function(){
    'use strict';

    /**
     * Created by Maxime on 1/15/2015.
     */
    var fs          = require('fs');
    var path        = require('path');
    var validator   = require('validator');

    module.exports = {

        /**
         *
         * @param location
         * @returns {*}
         */
        browse: function(location){
            if(location === 'remote'){
                return this.browseRemote();
            }
            return this.browseLocal();
        },

        /**
         *
         * @returns {Array}
         */
        browseRemote: function(){
            return new Promise(function(resolve, reject){
                resolve([]);
            });
        },

        /**
         *
         * @returns {*}
         */
        browseLocal: function(){
            var self    = this;
            var widgets = [];
            return new Promise(function(resolve, reject){
                try{
                    var paths = fs.readdirSync(sails.config.repository.localPath);
                }
                catch(err){
                    sails.log.warn('Try to access widgets local path %s that doesnt exist', sails.config.repository.localPath);
                    return resolve([]);
                }
                paths.forEach(function(widgetPath){
                    try{
                        var widgetPackage = JSON.parse(fs.readFileSync(path.join(sails.config.repository.localPath, widgetPath, 'package.json'), 'utf-8'));
                        if(self.isPackageValid(widgetPackage)){
                            widgets.push(widgetPackage);
                        }
                    }
                    catch(e){
                        if(e.code === 'ENOENT'){
                            // fail silent, package is invalid
                        }
                        else{
                            reject(e);
                        }
                    }
                });
                resolve(widgets);
            });
        },

        /**
         * @todo search is slow because of scanning all files
         * @param widgetIdentity
         */
        loadLocal: function(widgetIdentity){
            return this
                .browseLocal()
                .then(function(widgets){
                    var widgetToReturn = null;
                    widgets.forEach(function(widget){
                       if(widget.identity === widgetIdentity){
                           widgetToReturn = widget;
                       }
                    });
                    widgetToReturn.options = {};
                    return widgetToReturn;
                })
        },

        /**
         * Check if a widget package is valid
         */
        isPackageValid: function(widgetPackage){
            // @todo
            return true;
        }

    };
})();