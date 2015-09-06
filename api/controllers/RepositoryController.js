(function(){
    'use strict';

    var validator = require('validator');

    module.exports = {

        /**
         * Browse all widgets from the repository
         * @param req
         * @param res
         */
        findAll: function(req, res){

            var location = req.param('location', 'remote');
            if( ['local', 'remote'].indexOf(location) === -1 ){
                return res.badRequest('bad location');
            }

            RepositoryService
                .browse(location)
                .then(function(widgets){
                    return res.ok(widgets);
                })
                .catch(res.serverError);

        },

    };

})();
