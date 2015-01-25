/**
 * Created by Maxime on 12/23/2014.
 */
var validator = require('validator');

module.exports = {

    attributes: {
        user: {model:'user', required: true},
        widget: {model:'widget', required: true},
        options: {type:'json', defaultsTo: {}},
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
            else return null;
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
    }
};
