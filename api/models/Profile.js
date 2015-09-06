/**
 * Profile model
 * @description At least one profile should exist for every users
 */
var Profile = {
    
    // Enforce model schema in the case of schemaless databases
    schema: true,
    
    attributes: {

        user        : { model: 'user' },

        name        : { type: 'string',  unique: true, required: true },

        description : { type: 'text', size: 300, unique: false, required: false },

        default     : { type: 'boolean', unique: false, required: false, defaultsTo: true },

        widgets     : { collection: 'profileWidget', via: 'profile' },

        toView: function(){

            // We need to clone it (problem with populate that will not show up on json)
            var data = _.cloneDeep(this.toObject());

            if(!data.widgets){
                data.widgets = [];
            }

            return data;

        },
    },

    /**
     * - Ensure that only one profile for one user is activated 
     * @param values
     * @param cb
     * @returns {*}
     */
    beforeCreate: function(values, cb){

        async.series([
            function checkUniqueDefault(cb){
                if( values.user && values.default && values.default === true ){
                    sails.models.profile.findOne().where({ user: values.user, default: true })
                        .then(function(profile){
                            console.log(profile);
                            if(profile && profile.id !== values.id){
                                profile.default = false;
                                return profile.save(cb);
                            }
                            return cb();
                        }).catch(cb);
                }
                else{
                    return cb();
                }

            }
            
        ], function(error){
            return cb(error);
        });
    },

    /**
     * - Ensure that only one profile for one user is activated
     * @param values
     * @param cb
     * @returns {*}
     */
    beforeUpdate: function(values, cb){
        async.series([
            function checkUniqueDefault(cb){
                if( values.user && values.default && values.default === true ){
                    console.log({ user: values.user, default: true });
                    sails.models.profile.findOne().where({ user: values.user, default: true })
                        .then(function(profile){
                            if(profile && profile.id !== values.id){
                                profile.default = false;
                                return profile.save(cb);
                            }

                            return cb();
                        }).catch(cb);
                }
                else{
                    return cb();
                }

            }

        ], function(error){
            return cb(error);
        });
    }
    
};

module.exports = Profile;
