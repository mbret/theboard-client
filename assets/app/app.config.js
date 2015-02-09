(function () {
    'use strict';

    var app = angular.module('app')
        /**
         * get executed during the provider registrations and configuration phase.
         * Only providers and constants can be injected into configuration blocks.
         * This is to prevent accidental instantiation of services before they have been fully configured.
         *
         * @alias:
         * value('a', 123).
         * factory('a', function() { return 123; }).
         * directive('directiveName', ...).
         * filter('filterName', ...);
         */
        .config(function(){})
        /**
         *  get executed after the injector is created and are used to kickstart the application.
         *  Only instances and constants can be injected into run blocks.
         *  This is to prevent further system configuration during application run time.
         *
         *  - It's possible to get constant from includer module
         */
        .run(function(){});
    
})();
