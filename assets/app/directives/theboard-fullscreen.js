(function() {
    'use strict';

    /**
     * Fullscreen directive
     *
     * This directive allow you to pass a method to execute when window pass in fullscreen state
     *
     *  - theboard-fullscreen="myMethod" The method to execute. function myMethod(event){ ... }
     *  - theboard-fullscreen-use-window="true" Whether you want to bind fullscreen event to the element or the global window
     *
     * Note that the method is automatically unbound to the event when directive is destroyed.
     */
    angular
        .module('app.directives')
        .directive('theboardFullscreen', theboardFullscreen);

    function theboardFullscreen ($window) {

        return {
            restrict: 'A',
            scope: {
                method: '&theboardFullscreen',
                useWindow: '=theboardFullscreenUseWindow'
            },
            link: function(scope, element, attrs) {

                if(!scope.useWindow){
                    scope.useWindow = false;
                }

                var fn = scope.method();

                if(scope.useWindow){
                    angular.element($window).on('resize', fn);
                }
                else{
                    // ...
                }

                scope.$on('$destroy', function(){
                    angular.element($window).off('resize', fn);
                })
            }
        };
    }
})();
