(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('SettingsController', SettingsController)
        .controller('SettingsGeneralController', SettingsGeneralController)
        .controller('SettingsAccountController',SettingsAccountController)
        .controller('SettingsBoardController',SettingsBoardController);

    
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
    
    /**
     *
     */
    SettingsBoardController.$inject = ['$scope', '$http', 'user','notifService', 'APP_CONFIG', '_', 'modalService', 'userService'];
    function SettingsBoardController($scope, $http, user, notifService, APP_CONFIG, _, modalService, userService){
        
        var self = this;
        
        self.settings = {
            backgroundImageInterval: user.getSetting( user.SETTING_BACKGROUND_IMAGES_INTERVAL, true ) / 1000,
            backgroundImages: _.map(user.backgroundImages, function(image){
                return {
                    src: image,
                    showDelete: false
                }
            }),
            backgroundDefault: user.getSetting( user.SETTING_BACKGROUND_USE_DEFAULT, true )
        };
        
        console.log(self.settings);
        
        $scope.knobOptions = {
            min: 5,
            max: 60
        };
        
        // Set scope for widgets settings
        self.widgets = {
            borders: user.settings.widgetsBorders
        };
        
        // Configure the dropzone directive
        // This directive handle hover on background images
        self.dropzone = {
            config: {
                url: "/api/users/backgroudimages",
                maxFilesize: 100,
                paramName: "uploadfile",
                maxThumbnailFilesize: 5,
                init: function() {
                    var selfDropzone = this;
                    selfDropzone.on('success', function(file, json){
                        $scope.$apply(function(){
                            self.settings.backgroundImages.push({src: json});
                        });
                        user.addBackgroundImage(json);
                    });
                }
            }
        };

        /**
         * Widget settings form handler.
         */
        self.widgetsFormSubmit = function(){
            if($scope.widgetsForm.$valid){
                user.setSetting( user.SETTING_WIDGETS_BORDERS, self.widgets.borders);
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
        };
        
        self.backgroundFormSubmit = function(){
            if($scope.widgetsForm.$valid){
                console.log(self.settings.backgroundImageInterval);
                user.setSetting( user.SETTING_BACKGROUND_USE_DEFAULT, self.settings.backgroundDefault );
                user.setSetting( user.SETTING_BACKGROUND_IMAGES_INTERVAL, self.settings.backgroundImageInterval * 1000);
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
        };
        
        // Hover for background images
        $scope.hover = function(image) {
            return image.showDelete = ! image.showDelete;
        };

        /**
         * Delete a background image.
         * @param image
         * @returns {boolean}
         */
        $scope.delete = function(image) {
            user.removeBackgroundImage(image.src);
            user.save()
                .then(function(){
                    notifService.success( APP_CONFIG.messages.success.deleted );
                    _.remove(self.settings.backgroundImages, function(n) {
                        return image === n;
                    });
                })
                .catch(function(err){
                    modalService.simpleError(err.message);
                });
        };

    };
})();