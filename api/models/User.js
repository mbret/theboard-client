var User = {
    // Enforce model schema in the case of schemaless databases
    schema: true,
    
    attributes: {
        email     : { type: 'email',  unique: true },
        passports : { collection: 'Passport', via: 'user' },

        firstName: { type: 'string' },
        lastName: { type: 'string' },
        backgroundImagesInterval: { type: 'integer' },
        backgroundImages: { type: 'array' },
        
        avatar: { type: 'string', required: false },
        banner: { type: 'string', required: false },

        settings: { collection:'userSetting', via: 'user' },
        
        getAvatar: function(){
            if( _.isUndefined(this.avatar) || _.isNull(this.avatar)){
                return sails.config.imagesURL + '/' + sails.config.user.default.avatar;
            }
            else{
                return this.avatar;
            }
        },

        getBanner: function(){
            if( _.isUndefined(this.banner) || _.isNull(this.banner)){
                return sails.config.imagesURL + '/' + sails.config.user.default.banner;
            }
            else{
                return this.banner;
            }
        },

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
            
            data.avatar = this.getAvatar();
            data.banner = this.getBanner();
            return data;
            
        }
        
    }
};

module.exports = User;
