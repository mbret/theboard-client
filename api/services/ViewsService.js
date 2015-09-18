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
        //var user = req.user;
        var config = _.assign(sails.config.views.configToInject, {

            repositoryLocalUri: sails.config.repository.localUri,
            repositoryRemoteUri: sails.config.repository.remoteUri,

            // user logged
            // user: user.toView()
            //user: {
            //    defaultAttributes: {
            //        avatar: sails.config.urls.images + '/' + sails.config.user.default.avatar,
            //        banner: sails.config.urls.images + '/' + sails.config.user.default.banner,
                    //backgroundImages: _.map(sails.config.user.default.backgroundImages, function(image){
                    //    return sails.config.urls.images + '/board-bg-sample/' + image;
                    //}),
                    //settings: sails.config.user.default.settings
                //}
            //}
        });

        //config.user.useragent = req.headers['user-agent'];
        //config.user.profile = req.session.profile;
        return config;
    }
    
};
