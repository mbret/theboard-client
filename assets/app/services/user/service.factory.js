(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app.services')
        .factory('userService', userService);

    function userService(localStorageService, dataservice, APP_CONFIG){

        return {

            coucou: 10
        };
    }

})();