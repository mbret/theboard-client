(function () {
    'use strict';

    angular
        .module('app')
        .factory('InputService', InputService);

    InputService.$inject = ['$log', '$rootScope', 'logger'];

    function InputService($log, $rootScope, logger) {

        return {
            on: function(evtName, cb){

            }
        };

    }

})();