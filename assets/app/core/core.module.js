(function () {
    'use strict';

    angular.module('app.core', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'gridster',

        'blocks.exception', // wrap angular exception handling
        'blocks.logger', // wrap angular logging
        'blocks.pageTitle',

        'app.services',
        'app.controllers',
        'app.directives',
    ]);

})();
