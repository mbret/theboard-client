(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('AccountController', AccountController)

    AccountController.$inject = ['$scope', 'user', 'APP_CONFIG'];

    /**
     *
     */
    function AccountController($scope, user, APP_CONFIG){

        var self = this;
        self.user = {
            avatar: user.avatar || APP_CONFIG.user.default.avatar,
            banner: user.banner || APP_CONFIG.user.default.banner,
            job: 'Developer',
            address: user.address ? user.address : 'No address specified',
            phone: '(+33) 6 06 65 87 55',
            email: user.email,
            aboutMe: user.aboutMe ? user.aboutMe : "I didn't write anything about me for now",
            firstName: user.firstName,
            lastName: user.lastName,
            // @todo use filter here
            smartName: user.firstName ? ((user.lastName) ? user.firstName + ' ' + user.lastName : user.firstName) : user.email
        };

    };
})();
