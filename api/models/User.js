var User = {
    // Enforce model schema in the case of schemaless databases
    schema: true,
    
    attributes: {
        email     : { type: 'email',  unique: true },
        passports : { collection: 'Passport', via: 'user' },

        firstName: { type: 'string' },
        lastName: { type: 'string' },
        backgroundImagesInterval: { type: 'integer' },
        backgroundImages: { type: 'array', required:false },
        
        avatar: { type: 'string', required: false }, // default value set in lifecycle callback
        banner: { type: 'string', required: false }, // default value set in lifecycle callback

        settings: { collection:'userSetting', via: 'user' },

        /**
         * Return the value of the asked settings
         * Return the default value if the setting is not yet set
         * WARNING you have to populate settings
         * @param settingName
         */
        getSettingValue: function(settingName){
            var setting = _.find(this.settings, function(obj){
                return obj.name === settingName;
            });
            return _.isUndefined(setting) ? sails.config.user.default.settings[settingName] : setting.getValue();
        },

        setSettingValueOrCreate: function(settingName, value){
            var setting = _.find(this.settings, function(obj){
                return obj.name === settingName;
            });
            // No setting yet
            // Add the setting only if it's a possible setting
            if(_.isUndefined(setting)){
                var newSetting = UserSetting.buildNewSetting(settingName, value);
                this.settings.add(newSetting);
            }
            // setting found
            else{
                setting.setValue(value);
            }
        },

        /**
         * Return a user object for the view
         * all sensitive data are removed
         */
        toView: function(){
            var data = this.toObject();
            var that = this;
            
            // Loop over all supposed settings
            // Fill setting with user value
            // In that way the settings array returned to app contain all settings (with possible default values)
            var userSettings = {};
            _.forEach(sails.config.user.settings, function(setting, key){
                userSettings[key] =  that.getSettingValue(key);
            });
            data.config = userSettings;
            
            return data;
            
        }
        
    },

    beforeCreate: function(values, cb){
        // check avatar
        if( _.isUndefined(values.avatar) || _.isNull(values.avatar)){
            values.avatar = this._getDefaultAvatar();
        }
        // Check banner
        if( _.isUndefined(values.banner) || _.isNull(values.banner)){
            values.banner = this._getDefaultBanner();
        }
        // Check backgroundImages
        if(_.isUndefined(values.backgroundImages) || _.isEmpty(values.backgroundImages)){
            values.backgroundImages = this._getDefaultBackgroundImages();
        }
        // Check backgroundImagesInterval
        if( _.isUndefined(values.backgroundImagesInterval) || _.isNull(values.backgroundImagesInterval)){
            values.backgroundImagesInterval = this._getDefaultBackgroundImagesInterval();
        }
        console.log(values);
        return cb();
    },

    beforeUpdate: function(values, cb){
        return cb();
    },

    _getDefaultAvatar: function(){
        return sails.config.imagesURL + '/' + sails.config.user.default.avatar;
    },

    _getDefaultBanner: function(){
        return sails.config.imagesURL + '/' + sails.config.user.default.banner;
    },

    _getDefaultBackgroundImages: function(){
        var bgImages = [];
        _.forEach(sails.config.user.default.backgroundImages, function(image){
            bgImages.push(sails.config.imagesURL + '/' + image)
        });
        return bgImages;
    },

    _getDefaultBackgroundImagesInterval: function(){
        return sails.config.user.default.backgroundImagesInterval;
    }
};

module.exports = User;
