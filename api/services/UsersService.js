/**
 * Created by Maxime on 1/15/2015.
 */
module.exports = {

    /**
     * @todo copy sample bg into
     * @param user
     */
    prepareInstance: function(user){
        //_.forEach(sails.config.user.default.backgroundImages, function(image){
        //    console.log(process.cwd());
        //    fse.copy(sails.config.paths.imagesAssets + '/board-bg-sample/' + image, sails.config.paths.publicData + '/users/backgrounds/' + image, function(err){
        //        if(err) sails.log.error(err);
        //    });
        //});
        
    },

    prepareDefaultUserValues: function(){
        return {
            avatar: this._getDefaultAvatar(),
            banner: this._getDefaultBanner(),
            backgroundImages: this._getDefaultBackgroundImages(),
        }
        
    },
    
    _getDefaultAvatar: function(){
        //return sails.getBaseUrl() + '/' + sails.config.urls.images + '/' + sails.config.user.default.avatar;
        return '/' + sails.config.urls.images + '/' + sails.config.user.default.avatar;
    },

    _getDefaultBanner: function(){
        //return sails.getBaseUrl() + '/' + sails.config.urls.images + '/' + sails.config.user.default.banner;
        return '/' + sails.config.urls.images + '/' + sails.config.user.default.banner;
    },

    /**
     * @todo generate uuid with file extension in this way all images are unique for user
     * @returns {Array}
     * @private
     */
    _getDefaultBackgroundImages: function(){
        var bgImages = [];
        _.forEach(sails.config.user.default.backgroundImages, function(image){
            //bgImages.push(sails.getBaseUrl() + '/' + sails.config.urls.images + '/' + image);
            bgImages.push('/images/board-bg-sample/' + image);
        });
        return bgImages;
    }
    
};