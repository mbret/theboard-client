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

        //widget: {model:'widget', required: true},
        widget: {type:'string', required: true},

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
        sizeX: {type:'integer', required:true},
        sizeY: {type:'integer', required:true},
        row: {type:'integer', required:true},
        col: {type:'integer', required:true},

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
        }
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

    /**
     * Add a widget to a profile
     * @param identity The widget indentity
     * @param location
     * @return Promise (Error with code WIDGET_INVALID if widget doesn't exist or anything else invalid)
     */
    addToProfile: function(identity, location){
        return new Promise(function(resolve, reject){
            if(location === 'local'){
                RepositoryService
                    .loadLocal(identity)
                    .then(function(widget){
                        if(!widget){
                            var err = new Error();
                            err.code = 'WIDGET_INVALID';
                            reject(err);
                        }
                        resolve();
                    })
                    .catch(reject);
            }
            else{
                reject(new Error('not supported yet'));
            }
        });
    }
};
