//var validator = require('validator');
//var async = require('async');

(function(){

    module.exports = {

        index: function (req, res){
            return res.ok({
                title:  ViewsService.buildTitle(req.__('i18n_Index')),
            }, 'app/app');
        },

        /**
         * Return the current user as .js object for the view.
         * Just include this route as a script.
         * @param req
         * @param res
         */
        user: function(req, res){
            var user = req.user;
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', 0);
            res.send('window.USER = ' + JSON.stringify( user.toView() ) + ';');
        },
    };

})();
