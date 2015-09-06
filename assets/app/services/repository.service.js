(function () {
    'use strict';

    angular
        .module('app')
        .factory('RepositoryService', RepositoryService);

    RepositoryService.$inject = ['$log', '$rootScope', 'logger', 'dataservice'];

    /**
     *
     * @param $log
     * @param $rootScope
     * @param logger
     * @param dataservice
     * @returns {{browse: Function}}
     * @constructor
     */
    function RepositoryService($log, $rootScope, logger, dataservice) {

        return {

            browse: function(location){
                return dataservice.widgets.browse({
                    location: location
                });
            }

        };

    }

})();