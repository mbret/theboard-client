//var validator = require('validator');
//var async = require('async');

(function(){

    module.exports = {

        /**
         * Return the app page
         */
        index: function (req, res){
            return res.ok({
                routes: sails.config.app.routes
            }, 'app/app');
        },

        // Test the 404 view
        "404": function(req, res){
            return res.notFound();
        },

        // Test the 500 view
        "500": function(req, res){
            return res.serverError();
        }

    };

})();
