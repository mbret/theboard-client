/**
 * Created by Maxime on 12/23/2014.
 */

module.exports = {

    attributes: {

        author: 'email',
        identity: 'string',
        identityHTML: 'string',
        url: 'string',
        baseURL: 'string',
        permissions: 'array',
        options: 'array',
        sizeX: 'integer',
        sizeY: 'integer',
        row: 'integer',
        col: 'integer',
        
        profiles: { collection: 'profile', via: 'widgets' }
    },

    beforeCreate: function(values, cb){
        _.forEach(values.options, function(option){
            if( ! option.required ){
                option.required = false;
            }
        })
        return cb();
    }
};
