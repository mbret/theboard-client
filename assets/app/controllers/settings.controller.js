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
    SettingsController.$inject = ['$scope', '$http', 'user','modalService', 'APP_CONFIG', 'notifService'];
    function SettingsController($scope, $http, user, modalService, APP_CONFIG, notifService){


    };
    
    /**
     * form validation: http://www.ng-newsletter.com/posts/validations.html
     *
     */
    SettingsGeneralController.$inject = ['$scope', '$http', 'user','modalService', 'APP_CONFIG', 'notifService'];
    function SettingsGeneralController($scope, $http, user, modalService, APP_CONFIG, notifService){

        // Set scope for widgets settings
        $scope.widgets = {
            borders: user.settings.widgetsBorders
        };
        
        $scope.user = {
            firstName: user.firstName,
            lastName: user.lastName
        };

        console.log(user);
        
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

        /*===========================
         * Form submit (widgets)
         *===========================*/
        //$scope.submitted = false;
        $scope.widgetsFormSubmit = function(){
            if($scope.widgetsForm.$valid){
                user.setSetting( user.CONST.SETTING_WIDGETS_BORDERS, $scope.widgets.borders);
                user.save()
                    .then(function(){
                        notifService.success( APP_CONFIG.messages.success.form.updated )
                    }).catch(function(err){
                        modalService.simpleError(err.message);
                    });
            }
            else{
                notifService.error( APP_CONFIG.messages.errors.form.invalid );
            }
        }

    };

    /**
     *
     *
     */
    SettingsAccountController.$inject = ['$scope', '$http', 'user','modalService', 'APP_CONFIG', 'notifService'];
    function SettingsAccountController($scope, $http, user, modalService, APP_CONFIG, notifService){
        
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