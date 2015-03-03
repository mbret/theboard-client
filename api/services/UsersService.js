/**
 * Created by Maxime on 1/15/2015.
 */
module.exports = {

    /**
     * @todo copy sample bg into
     * @todo copy avatar sample
     * @todo copy banner sample
     * @param user
     */
    prepareInstance: function(user, initBG, initAvatar, initBanner){
        //_.forEach(sails.config.user.default.backgroundImages, function(image){
        //    console.log(process.cwd());
        //    fse.copy(sails.config.paths.imagesAssets + '/board-bg-sample/' + image, sails.config.paths.publicData + '/users/backgrounds/' + image, function(err){
        //        if(err) sails.log.error(err);
        //    });
        //});
    },

    prepareDefaultUserValues: function(){
        return {
            avatar: this.prepareSampleAvatar(),
            banner: this.prepareSampleBanner(),
            backgroundImages: this.prepareSampleBackgroundImages()
        }
    },
    
    prepareSampleAvatar: function(){
        //return sails.getBaseUrl() + '/' + sails.config.urls.images + '/' + sails.config.user.default.avatar;
        return '/' + sails.config.urls.images + '/' + sails.config.user.default.avatar;
    },

    prepareSampleBanner: function(){
        //return sails.getBaseUrl() + '/' + sails.config.urls.images + '/' + sails.config.user.default.banner;
        return '/' + sails.config.urls.images + '/' + sails.config.user.default.banner;
    },

    /**
     * @todo generate uuid with file extension in this way all images are unique for user
     * @returns {Array}
     * @private
     */
    prepareSampleBackgroundImages: function(){
        var bgImages = [];
        _.forEach(sails.config.user.default.backgroundImages, function(image){
            //bgImages.push(sails.getBaseUrl() + '/' + sails.config.urls.images + '/' + image);
            bgImages.push('/images/board-bg-sample/' + image);
        });
        return bgImages;
    }
    
};