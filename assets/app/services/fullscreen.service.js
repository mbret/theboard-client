(function () {
    'use strict';

    angular
        .module('app')
        .factory('fullscreenService', fullscreenService);

    function fullscreenService($log, $rootScope, logger, $window) {

        return {

            /**
             * Attach a function to the fullscreen event.
             * The function is automatically clear on scope destroy
             *
             * @param $scope
             * @param fn
             */
            onFullscreen: function($scope, fn){
                angular.element($window).on('resize', fn);
                $scope.$on('$destroy', function(){
                    angular.element($window).off('resize', fn);
                });
            },
            on: function(evtName, cb){

            }
        };

    }

})();