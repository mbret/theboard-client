(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('StaticController', StaticController)

    StaticController.$inject = ['$scope', 'user', 'APP_CONFIG', 'RepositoryService'];

    /**
     *
     */
    function StaticController($scope, user, APP_CONFIG, RepositoryService){

        $scope.parent = {
            title: 'Title'
        };


    };
})();
