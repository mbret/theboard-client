/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        /**
         * When bootstrapping, first Angular applies all constant definitions. 
         * Then Angular applies configuration blocks in the same order they were registered.
         */
        .constant('core', 'core')
        .constant('toastr', window.toastr)
        .constant('_', window._);


})();
