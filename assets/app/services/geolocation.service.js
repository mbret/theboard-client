(function () {
    'use strict';

    /**
     * @todo we should handle here runtime error when retrieving geoloc.
     * @todo we should let the main program handle error like (permission, no location etc)
     */
    angular
        .module('app')
        .factory('geolocationService', geolocationService);

    geolocationService.$inject = ['$q','$rootScope','$window','APP_CONFIG'];

    function geolocationService($q,$rootScope,$window,APP_CONFIG) {

        return {

            getLocation: function (opts) {

                var deferred = $q.defer();

                if ($window.navigator && $window.navigator.geolocation) {
                    $window.navigator.geolocation.getCurrentPosition(function(position){
                        $rootScope.$apply(function(){
                            deferred.resolve(position);
                        });
                    }, function(error) {
                        switch (error.code) {
                            case 1:
                                deferred.reject(APP_CONFIG.messages.errors.geolocation.permissionDenied);
                                break;
                            case 2:
                                deferred.reject(APP_CONFIG.messages.errors.geolocation.positionUnavailable);
                                break;
                            case 3:
                                deferred.reject(APP_CONFIG.messages.errors.geolocation.timeout);
                                break;
                        }
                    }, opts);
                }
                else{
                    deferred.reject(APP_CONFIG.messages.errors.geolocation.unsupportedBrowser);
                }
                return deferred.promise;
            }
        };
    }

})();