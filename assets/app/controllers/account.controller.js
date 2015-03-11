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

        this.user = user;
        this.user.avatar = user.avatar || APP_CONFIG.user.default.avatar;
        this.user.banner = user.banner || APP_CONFIG.user.default.banner;
        this.user.address = user.address ? user.address : 'No address specified';
        this.user.aboutMe = user.aboutMe ? user.aboutMe : "I didn't write anything about me for now";
        this.user.smartName = user.firstName ? ((user.lastName) ? user.firstName + ' ' + user.lastName : user.firstName) : user.email;

    };
})();
