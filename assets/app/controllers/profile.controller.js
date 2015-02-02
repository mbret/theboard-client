(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ProfileController', ProfileController)

    ProfileController.$inject = ['$scope', 'config'];

    /**
     *
     */
    function ProfileController($scope, config){

        $scope.user = {
            avatar: config.user.avatar,
            banner: config.user.banner,
            job: 'Developer',
            address: 'Nancy, France',
            phone: '(+33) 6 06 65 87 55',
            email: config.user.email,
            firstName: config.user.firstName,
            lastName: config.user.lastName,
            displayName: config.user.firstName ? config.user.firstName : config.user.email
        };

    };
})();