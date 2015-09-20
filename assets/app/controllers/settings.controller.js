(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('SettingsController', SettingsController)
        .controller('SettingsGeneralController', SettingsGeneralController)
        .controller('SettingsAccountController',SettingsAccountController);
    
    /**
     *
     *
     */
    SettingsController.$inject = ['$rootScope', '$http', 'user','modalService', 'APP_CONFIG', 'notifService'];
    function SettingsController($rootScope, $http, user, modalService, APP_CONFIG, notifService){

        $rootScope.$on('$stateChangeStart', function watchStateChanges(event, toState, toParams, fromState, fromParams){
            var isSetting = (fromState.name.split('.'))[0] === 'settings';
        });
        $rootScope.$on('$stateChangeSuccess', function watchStateChanges(event, toState, toParams, fromState, fromParams){
            var isSetting = (toState.name.split('.'))[0] === 'settings';
        });

    };
    
    /**
     * form validation: http://www.ng-newsletter.com/posts/validations.html
     *
     */
    SettingsGeneralController.$inject = ['$scope', '$http', 'user','modalService', 'APP_CONFIG', 'notifService', 'userService'];
    function SettingsGeneralController($scope, $http, user, modalService, APP_CONFIG, notifService, userService){

        
        
        $scope.user = {
            firstName: user.firstName,
            lastName: user.lastName
        };

        /*===========================
         * Form submit (profile)
         *===========================*/
        //$scope.submitted = false;
        $scope.userFormSubmit = function(){
            if($scope.userForm.$valid){
                user.firstName = $scope.user.firstName;
                user.lastName = $scope.user.lastName;
                user.save()
                    .then(function(){
                        notifService.success( APP_CONFIG.messages.success.form.updated )
                    })
                    .catch(function(err){
                        modalService.simpleError(err.message);
                    });
            }
            else{
                notifService.error( APP_CONFIG.messages.errors.form.invalid );
            }
        };

        

    };

    /**
     *
     *
     */
    SettingsAccountController.$inject = ['$scope', '$http', 'user','modalService', 'APP_CONFIG', 'notifService', 'userService'];
    function SettingsAccountController($scope, $http, user, modalService, APP_CONFIG, notifService, userService){
        
        var self = this;
        self.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            email: user.email
        };

        self.accountFormSubmit = function(){
            if($scope.accountForm.$valid){
                user.firstName = self.user.firstName;
                user.lastName = self.user.lastName;
                user.address = self.user.address;
                user.save()
                    .then(function(){
                        notifService.success( APP_CONFIG.messages.form.updated )
                    })
                    .catch(function(err){
                        modalService.simpleError(err.message);
                    });
            }
            else{
                notifService.error( APP_CONFIG.messages.form.invalid );
            }
        };
    };

})();