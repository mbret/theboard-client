(function () {

    'use strict';

    angular.module('app.config',[])
    .constant('_', _)
    /**
     * config get injected by 'app' as a constant when config is retrieved from server
     */
    .config(function configureConfig(APP_CONFIG, _){
        // deep merge
        _.merge(APP_CONFIG, {
            appErrorPrefix: '[Board: Error] ',
            routes: {
                templates: APP_CONFIG.routes.app + '/views/templates',
                partials: APP_CONFIG.routes.app + '/views/partials'
            }
        });
    });

})();
