var util = require('util');
module.exports = {

    attributes: {

        /**
         * This method protect sensitive data before sending to customers
         * - overwrite this method in child model
         */
        toJSON: function() {
            var model = this.toObject();
            return model;
        },

    },

    /**
     * Call .toJSON() to all model inside the given array and return it
     */
    toJSON: function( models ){
        if(!models) return {};
        if(!util.isArray(models)){
            return models.toJSON();
        }
        else{
            var customerModels = [];
            models.forEach(function(model){
                customerModels.push( model.toJSON() );
            });
            return customerModels;
        }
    }

};