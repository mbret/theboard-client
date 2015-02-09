(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('SettingsController', SettingsController)

    SettingsController.$inject = ['$scope', '$http', 'user','modalService', 'APP_CONFIG', 'notifService'];

    /**
     * form validation: http://www.ng-newsletter.com/posts/validations.html
     *
     */
    function SettingsController($scope, $http, user, modalService, APP_CONFIG, notifService){

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
})();