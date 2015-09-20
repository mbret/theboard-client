'use strict';

var UserSetting = {

    tableName: 'user_setting',
    autoCreatedAt: true,
    autoUpdatedAt: true,
    schema: true,

    attributes: {

        user        : { model: 'user' }, // DO NOT use required:true (I don't know why but it crash when update later)
        name        : { type: 'string', required: true }, // simulate enum later
        type        : { type: 'string', required: true, enum: ['boolean', 'string', 'integer', 'array']},
        value       : { type: 'string' },
        profile     : { model: 'profile', required: true },

        //getValue: function(){
        //    switch (this.type){
        //        case 'boolean':
        //            return this.valueBoolean;
        //        case 'integer':
        //            return this.valueNumber;
        //        default:
        //            return this.valueString;
        //    }
        //},

        //setValue: function(value){
        //    this[UserSetting.getValueKey(this.type)] = UserSetting._convertValue(this.type, value);
        //}

        toView: function(){
            var data = this.toObject();
            data.value = JSON.parse(data.value);
            return data;
        }
    },

    beforeValidate: function(values, cb){
        return cb();
    },

    beforeCreate: function(values, cb){
        //switch(values.type){
        //    case 'array':
        //        values.value = JSON.parse(values.value);
        //}
        return cb();
    },

    //buildNewSetting: function(name, value){
    //    // This setting doesnt exist
    //    if(_.isUndefined(sails.config.user.settings[name]) ){
    //        var error = new Error('The setting with key ' + name + ' is not a valid setting and cannot be build!');
    //        error.code = 'INVALID_USER_SETTING';
    //        throw error
    //    }
    //    // build setting with help of config
    //    var type = sails.config.user.settings[name].type;
    //    var valueKey = UserSetting.getValueKey(type);
    //    var setting = {
    //        name: name,
    //        type: type
    //    };
    //    setting[valueKey] = UserSetting._convertValue(type, value);
    //    return setting;
    //},

    //getValueKey: function(type){
    //    switch (type){
    //        case 'boolean':
    //            return 'valueBoolean';
    //        case 'integer':
    //            return 'valueNumber';
    //        default:
    //            return 'valueString';
    //    }
    //},

    getValue: function(setting){
        switch (type){
            case 'boolean':
                return value == 'true';
            case 'integer':
                return parseInt(value);
            default:
                return value;
        }
    },

    /**
     * Create the default settings for a user's profile.
     * @param user
     * @param profile
     * @return Promise
     */
    createDefaultSettingsForUser: function(user, profile){

        var promises = [];
        _.forEach(sails.config.users.defaultSettings, function(setting, key){
            promises.push(sails.models.usersetting.create({
                user    : user,
                profile : profile,
                name    : key,
                type    : setting.type,
                value   : JSON.stringify(setting.value)
            }))
        });

        return Promise.all(promises);
    }
};

module.exports = UserSetting;