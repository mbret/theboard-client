(function () {
    'use strict';

    angular.module('app.core', [

        'app.config',
        
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'gridster',

        'blocks.exception', // wrap angular exception handling
        'blocks.logger', // wrap angular logging
        'blocks.pageTitle',
        
        'app.controllers',
        'app.services',
        'app.directives',
    ]);

})();
