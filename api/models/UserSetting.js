(function(){
    'use strict';

    var UserSetting = {
        // Enforce model schema in the case of schemaless databases
        schema: true,
        //autoPK: false,

        attributes: {
            user        : { model: 'user' }, // DO NOT use required:true (I don't know why but it crash when update later)
            name        : { type: 'string', required: true }, // simulate enum later
            type        : { type: 'string', required: true, enum: ['boolean', 'string', 'integer']},
            valueString : { type: 'string' },
            valueBoolean: { type: 'boolean' },
            valueNumber : { type: 'integer' },

            getValue: function(){
                switch (this.type){
                    case 'boolean':
                        return this.valueBoolean;
                    case 'integer':
                        return this.valueNumber;
                    default:
                        return this.valueString;
                }
            },

            setValue: function(value){
                this[UserSetting.getValueKey(this.type)] = UserSetting._convertValue(this.type, value);
            }
        },

        beforeValidate: function(values, cb){
            return cb();
        },
        
        beforeCreate: function(values, cb){
            return cb();
        },

        beforeUpdate: function(values, cb){
            return cb();
        },
        
        buildNewSetting: function(name, value){
            //if(!_.isNumber(userId)){
            //    throw new Error('To build a new setting object, a user id is required!');
            //}
            // This setting doesnt exist
            if(_.isUndefined(sails.config.user.settings[name]) ){
                throw new Error('The setting with key ' + name + ' is not a valid setting and cannot be build!');
            }
            // build setting with help of config
            var type = sails.config.user.settings[name].type;
            var valueKey = UserSetting.getValueKey(type);
            var setting = {
                //id: userId + '_' + name,
                name: name,
                type: type
            };
            setting[valueKey] = UserSetting._convertValue(type, value);
            return setting;
        },

        getValueKey: function(type){
            switch (type){
                case 'boolean':
                    return 'valueBoolean';
                case 'integer':
                    return 'valueNumber';
                default:
                    return 'valueString';
            }

        },

        _convertValue: function(type, value){
            switch (type){
                case 'boolean':
                    return value == 'true';
                case 'integer':
                    return parseInt(value);
                default:
                    return value;
            }
        }
    };

    module.exports = UserSetting;
    
})();

