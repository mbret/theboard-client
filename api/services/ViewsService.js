/**
 * Created by Maxime on 1/15/2015.
 */
var url = require('url');
module.exports = {



    /**
     * Build a valid title for the view.
     * Just pass the view relevant title and get back the complete app title. (with pre/post info).
     * @param title
     * @returns {string}
     */
    buildTitle: function(title){
        title = title || "";
        return sails.config.views.preTitle + ' ' + sails.config.views.titleSeparator + ' ' + title;
    },

    /**
     * Generate the public configuration for web app.
     * Use the server config and mix/drop/add some values.
     * Take advantage of programmatic code in order to add config already set in /config and doesn't belong to /config/view
     * @param user
     * @returns {*}
     */
    generateConfiguration: function(user){

        var config = _.assign(sails.config.views.configToInject, {
            repositoryLocalUri: sails.config.repository.localUri,
            repositoryRemoteUri: sails.config.repository.remoteUri,
            //defaultUserSettings: sails.config.users.defaultSettings
        });

        return config;
    }
    
};
