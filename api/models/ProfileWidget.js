/**
 * Created by Maxime on 12/23/2014.
 */
var validator = require('validator');

module.exports = {

    tableName: 'profile_widget',
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
    schema: true,
    
    attributes: {
        
        profile: {model: 'profile', required: true},

        widget: {type:'string', required: true, unique: true},

        location: {
            type: 'string',
            required: true,
            enum: ['local', 'remote']
        },

        /*
         * relative to widget only
         */
        // options concern possible options for a widget
        options: {type:'json', defaultsTo: {}},
        
        // widget position
        sizeX: {type:'integer', required:false},
        sizeY: {type:'integer', required:false},
        row: {type:'integer', required:false},
        col: {type:'integer', required:false},

        setOptionValue: function(id, value){
            this.options[id] = value;
            //console.log(this.options);
        },

        getOptionValue: function(name){
            if(this.options && this.options[name]){
                return this.options[name];
            }
            else{
                return null;
            }
        },

        /**
         * Load the complete widget with all its information.
         * ex author, creation date, etc.
         * The widget will merge local profile data and general data.
         */
        loadCompleteObject: function(){
            var self = this;
            return new Promise(function(resolve, reject){
                if(self.location === 'local'){
                    RepositoryService.loadLocal(self.widget)
                        .then(function(widget){

                            // Merge local widget with specific profile data
                            var completeWidget = _.assign(widget, self);

                            // We also set widget options specific for our user
                            //_.forEach(completeWidget.options, function(option, index){
                            //    option.value = profileWidget.getOptionValue(option.id);
                            //});
                            resolve(completeWidget);
                        })
                        .catch(reject);
                }
                else{
                    return reject(new Error('ProfileWidget.loadCompleteObject not supported for remote widgets'));
                }
            });
        },

    },
    
    beforeCreate: function(values, cb){
        //if( values.options && ! validator.isJSON(values.options) ){
        //    console.log(values.options, validator.isJSON(values.options));
        //    var error = new Error("Invalid JSON for field 'options'");
        //    error.ValidationError = true;
        //    return cb(error);
        //}
        return cb();
    },

    toView: function(object){
        var data = _.cloneDeep(object);

        return data;
    },

    /**
     * Register a new widget
     * This method use a queue so you NEED to call user.save in order to save these change
     * @param identity The widget indentity
     * @param location
     * @return Promise (Error with code WIDGET_INVALID if widget doesn't exist or anything else invalid)
     */
    createWithRepo: function(identity, location, profile, data){
        if( typeof data === "undefined" ){
            data = {};
        }

        var self = this;

        // Load widget
        return new Promise(function(resolve, reject){

            // load by local
            if(location === 'local'){

                RepositoryService
                    .loadLocal(identity)
                    .then(function(widget){

                        if(!widget){
                            var err = new Error();
                            err.code = 'WIDGET_INVALID';
                            reject(err);
                        }

                        var registered = {
                            sizeX: data.sizeX || 1,
                            sizeY: data.sizeY || 1,
                            row: data.row || 0,
                            col: data.col || 0,
                            options: data.options || {},
                            widget: identity,
                            location: location,
                            profile: profile
                        };

                        // fill options
                        //var widgetOptions = {};
                        //_.forEach(widget.options, function(option, index){
                        //    widgetOptions[option.id] = (option.default) ?  option.default : null;
                        //});
                        //
                        //registered.options = options;

                        return ProfileWidget.create(registered)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            }
            else{
                reject(new Error('not supported yet'));
            }
        });
    },
};
