(function () {
    'use strict';

    angular.module('app.core', [

        'ui.router',
        'ui.bootstrap',
        'angularUtils.directives.uiBreadcrumbs',
        //'ngAnimate',
        'gridster',

        'angular-jwt',
        'LocalStorageModule',
        
        'blocks.exception', // wrap angular exception handling
        'blocks.logger', // wrap angular logging
        'blocks.backstretch',
        'blocks.pageTitle',

        'app.controllers',
        'app.services',
        'app.directives',
    ]);

})();
