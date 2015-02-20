(function () {
    'use strict';

    angular.module('app.core', [

        'app.config',
        
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'gridster',

        'angular-jwt',
        
        'blocks.exception', // wrap angular exception handling
        'blocks.logger', // wrap angular logging
        'blocks.backstretch',
        'blocks.pageTitle',
        
        'app.controllers',
        'app.services',
        'app.directives',
    ]);

})();
