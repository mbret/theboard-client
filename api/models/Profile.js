/**
 * Profile model
 * @description At least one profile should exist for every users
 */
var Profile = {
    
    // Enforce model schema in the case of schemaless databases
    schema: true,
    
    attributes: {
        user        : { model: 'user' },
        name        : { type: 'text',  unique: true, required: true },
        description : { type: 'text', unique: false, required: false },
        default     : { type: 'boolean', unique: false, required: false, defaultsTo: true },
        widgets     : { collection: 'profileWidget', via: 'profile' },

        /**
         * Register a new widget
         * This method use a queue so you NEED to call user.save in order to save these change
         * @param widget
         */
        registerWidget: function(widget, options){
            if( typeof options === "undefined" ){
                options = {};
            }
            
            var registered = {
                sizeX: options.sizeX || widget.sizeX,
                sizeY: options.sizeY || widget.sizeY,
                row: options.row || widget.row,
                col: options.col || widget.col,
                widget: widget.id
            };
            // fill options
            var widgetOptions = {};
            _.forEach(widget.options, function(option, index){
                widgetOptions[option.id] = (option.default) ?  option.default : null;
            });
            registered.options = options;
            this.widgets.add(registered);
        }
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
                    sails.models.profile.findOne().where({ user: values.user, default: true }).then(function(profile){
                        var error;
                        if(profile && profile.id !== values.id){
                            error = new Error('Only one profile can be set as default at the same time for one user');
                        }
                        return cb(error);
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
            function checkUniqueDefault(){
                if( values.user && values.default && values.default === true ){
                    sails.models.profile.findOne().where({ user: values.user, default: true }).then(function(profile){
                        var error;
                        if(profile && profile.id !== values.id){
                            error = new Error('Only one profile can be set as default at the same time for one user');
                        }
                        return cb(error);
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
