var fse = require('fs-extra');

var User = {
    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {
        email       : { type: 'email',  unique: true },
        passports   : { collection: 'Passport', via: 'user' },
        //token       : { type: 'string' },

        firstName: { type: 'string' },
        lastName: { type: 'string' },
        backgroundImages: { type: 'array', required: false },
        locale: { type:'string', defaultTo: 'en_US' },
        avatar: { type: 'string', required: false }, // default value set in lifecycle callback
        banner: { type: 'string', required: false }, // default value set in lifecycle callback
        address: { type: 'string', required: false },

        settings: { collection:'userSetting', via: 'user' },
        profiles: { collection: 'profile', via: 'user' },

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

        /**
         * Set the settings with this key for the user.
         * @param settingName
         * @param value
         */
        setSettingValueOrCreate: function(key, value){
            var setting = _.find(this.settings, function(obj){
                return obj.name === key;
            });
            // No setting yet
            // Add the setting only if it's a possible setting
            if(_.isUndefined(setting)){
                var newSetting = UserSetting.buildNewSetting(key, value);
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

            // We need to clone it (problem with populate that will not show up on json)
            var data = _.cloneDeep(this.toObject());
            var that = this;

            // Loop over all supposed settings
            // Fill setting with user value
            // In that way the settings array returned to app contain all settings (with possible default values)
            var userSettings = {};
            _.forEach(sails.config.user.settings, function(setting, key){
                userSettings[key] =  that.getSettingValue(key);
            });
            data.settings = userSettings;

            // @todo check how to only retrieve list of profile id instead of having this because of populate
            data.profiles = _.map(data.profiles, 'id');

            return data;

        }

    },

    beforeCreate: function(values, cb){
        // if(!values.profiles){
        //     console.log('add default profile');
        //     values.profiles = [];
        //     values.profiles.push({ name: 'Default', description: 'This is your first and default profile. You can add your own profile or edit / remove this profile.', default: true })
        // }
        return cb();
    },

    /**
     * This function is an alias for user.create.
     * It will create the user and init all settings relative to application like:
     *  - default profile
     *  - default settings
     *  - etc
     * @todo transactions , promises
     * @param data
     */
    createAndInit: function( data , cb ){
        // create user
        sails.models.user.create(data, function(err, user){
            if(err){
                return cb(err);
            }

            user.profiles.add( { name: 'Default', description: 'This is your first and default profile. You can add your own profile or edit / remove this profile.', default: true });
            user.save(function(err, user){
                return cb(err, user);
            });
        });
    }

};

module.exports = User;
