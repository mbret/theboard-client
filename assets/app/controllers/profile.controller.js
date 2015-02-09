(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ProfileController', ProfileController)

    ProfileController.$inject = ['$scope', 'user'];

    /**
     *
     */
    function ProfileController($scope, user){

        $scope.user = {
            avatar: user.avatar,
            banner: user.banner,
            job: 'Developer',
            address: 'Nancy, France',
            phone: '(+33) 6 06 65 87 55',
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.firstName ? user.firstName : user.email
        };

    };
})();