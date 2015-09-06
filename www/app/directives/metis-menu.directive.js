(function() {
    'use strict';

    /**
     *
     */
    angular
        .module('app.directives')
        .directive('metisMenu', metisMenu);

    metisMenu.$inject = ['$rootScope', '$timeout', 'APP_CONFIG'];

    /**
     * Apply the plugin metis menu to the element that have the directive
     * (in our app it come to the sidebar ul)
     */
    function metisMenu ($rootScope, $timeout, APP_CONFIG) {
        
        if (typeof $.fn.metisMenu !== 'function')
            throw new Error('metisMenu | Please make sure the jquery metisMenu plugin is included before this directive is added.');

        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                // Call the metsiMenu plugin and plug it to sidebar navigation
                $timeout(function(){
                    element.metisMenu();
                });
            }
        }
    }
})();
