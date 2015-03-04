/**
 * Created by Maxime on 1/15/2015.
 */

/**
 *
 * @type {{generateToken: Function, getTokenPayload: Function}}
 */
module.exports = {

    /**
     * Generate the ppublic configuration for web app.
     * Use the server config and mix/drop/add some values.
     * @param user
     * @returns {*}
     */
    generateConfiguration: function(){
        //var user = req.user;
        var config = _.assign(sails.config.app, {
            // user logged
            // user: user.toView()
            user: {
                default: {
                  avatar: sails.config.urls.images + '/' + sails.config.user.default.avatar,
                  banner: sails.config.urls.images + '/' + sails.config.user.default.banner,
                  backgroundImages: sails.config.user.default.backgroundImages,
                }
            }
        });

        //config.user.useragent = req.headers['user-agent'];
        //config.user.profile = req.session.profile;
        return config;
    }

};
