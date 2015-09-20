(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('SettingsBoardController',SettingsBoardController);

    /**
     *
     */
    function SettingsBoardController($scope, $http, user, notifService, APP_CONFIG, _, modalService, userService){
        
        var self = this;
        
        $scope.settings = {
            backgroundImageInterval: user.getSettingValue(user.SETTING_BACKGROUND_IMAGES_INTERVAL) / 1000,
            backgroundImages: [],
            background: user.getSettingValue(user.SETTING_BACKGROUND),
            widgets: {
                borders: user.getSettingValue(user.SETTING_WIDGETS_BORDERS)
            }
        };

        if(user.hasSetting(user.SETTING_BACKGROUND_IMAGES)){
            $scope.settings.backgroundImages = _.map(user.getSettingValue(user.SETTING_BACKGROUND_IMAGES), function(image){
                return {
                    src: APP_CONFIG.baseUrls.public + '/' + image,
                    showDelete: false
                }
            })
        }

        //console.log($scope.settings.backgroundImages)
        $scope.useDefaultBackgroundImage = user.hasSetting(user.SETTING_BACKGROUND_IMAGES);
        
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
                    selfDropzone.on('success', function(file, settingUpdated){

                        // Update user local setting
                        user.setSetting(user.SETTING_BACKGROUND_IMAGES, settingUpdated);

                        // Update scope images
                        $scope.settings.backgroundImages = _.map(settingUpdated.value, function(image){
                            return {
                                src: APP_CONFIG.baseUrls.public + '/' + image,
                                showDelete: false
                            }
                        });
                    });

                    // @todo des fois ça passe pas, la requête démarre sans le truc ...
                    selfDropzone.on('sending', function(file, xhr, formData){
                        formData.append('profile', user.profile);
                    });
                },
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

        /**
         * Background part form handler.
         */
        self.backgroundFormSubmit = function(){
            if($scope.widgetsForm.$valid){
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