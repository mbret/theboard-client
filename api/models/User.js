'use strict';

/**
 * User model
 */
module.exports = {

    schema: true,

    attributes: {

        firstName   : { type: 'string' },
        lastName    : { type: 'string' },
        locale      : { type:'string', defaultTo: 'en_US' },
        avatar      : { type: 'string', required: false },
        banner      : { type: 'string', required: false },
        address     : { type: 'string', required: false },
        settings    : { collection:'userSetting', via: 'user' },
        profiles    : { collection: 'profile', via: 'user' },

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
        //setSettingValueOrCreate: function(key, value){
        //    var setting = _.find(this.settings, function(obj){
        //        return obj.name === key;
        //    });
        //    // No setting yet
        //    // Add the setting only if it's a possible setting
        //    if(_.isUndefined(setting)){
        //        var newSetting = UserSetting.buildNewSetting(key, value);
        //        this.settings.add(newSetting);
        //    }
        //    // setting found
        //    else{
        //        setting.setValue(value);
        //    }
        //},

        /**
         * Return a user object for the view
         * all sensitive data are removed
         */
        toView: function(){

            // We need to clone it (problem with populate that will not show up on json)
            var data = _.cloneDeep(this.toObject());
            var that = this;

            data.profiles.forEach(function(profile){
               if(profile.default === true){
                   data.defaultProfile = profile.id;
               }
            });

            // @todo check how to only retrieve list of profile id instead of having this because of populate
            data.profiles = _.map(data.profiles, 'id');

            data.settings = [];
            this.settings.forEach(function(setting){
                data.settings.push(setting.toView());
            });

            console.log(data);
            return data;

        },


        toJSON: function () {
            var user = this.toObject();
            delete user.password;
            user.gravatarUrl = this.getGravatarUrl();
            return user;
        }

    },

    beforeCreate: function(values, cb){
        if(!values.avatar){
            values.avatar = sails.config.users.defaultAttributes.avatar;
        }
        if(!values.banner){
            values.banner = sails.config.users.defaultAttributes.banner;
        }
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
    createAndInit: function(data){

        // create user
        return sails.models.user.create(data)
            .then(function(user){

                // Create default profile
                user.profiles.add( { name: 'Default', description: 'This is your first and default profile. You can add your own profile or edit / remove this profile.', default: true });
                return user.save();

            })
            .then(function(user){

                // add default settings
                return sails.models.usersetting.createDefaultSettingsForUser(user.id, user.profiles[0])
                    .then(function(){
                        return user;
                    })
            });
    }

};
