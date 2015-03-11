(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app.services')
        .provider('user', userProvider)
        .factory('userService', userService);
    
    function userProvider(){
        
        var userData;
        
        return {
            setData: setData,
            $get: userFactory
        };

        /**
         * Set the data that will be used to build the user.
         * Typically it comes from server
         * @param data
         */
        function setData( data ){
            userData = data;
        }

        userFactory.$inject = ['userService'];
        /**
         * Build a user object that come will useful method.
         * This object represent logged user so there is only one.
         * SINGLETON
         */
        function userFactory(userService) {
            return new userService( userData );
        }
    }

    userService.$inject = ['localStorageService', 'dataservice', 'APP_CONFIG'];
    function userService(localStorageService, dataservice, APP_CONFIG){

        var User = function( data ){

            var self = this;

            /*
             * Attributes
             */
            self.profiles = angular.copy(data.profiles);
            // array of settings with their values
            self.settings = angular.copy(data.settings);
            self.id = data.id;
            self.email = data.email;
            self.backgroundImages = [];
            self.avatar = data.avatar;
            self.banner = data.banner;
            self.profile = data.profile;
            self.firstName = data.firstName;
            self.lastName = data.lastName;
            self.job = 'Developer';
            self.phone = '(+33) 6 06 65 87 55';

            if(data.backgroundImages && Array.isArray(data.backgroundImages)){
                self.backgroundImages = angular.copy(data.backgroundImages);
            }

            mergeLocal();

            /*
             * Constants
             * constants are here to reduce the use of potentially future changed strings.
             * Use them inside controller etc and change only here when server changed.
             */
            User.prototype.SETTING_WIDGETS_BORDERS = 'widgetsBorders';
            User.prototype.SETTING_BACKGROUND_IMAGES_INTERVAL = 'backgroundImagesInterval';
            User.prototype.SETTING_BACKGROUND_USE_DEFAULT = 'useDefaultBackground';
            
            User.prototype.addBackgroundImage = function( key ){
                self.backgroundImages.push(key);
            };

            User.prototype.removeBackgroundImage = function( key ){
                self.backgroundImages = _.remove(self.backgroundImages, function(n) {
                    return key !== n;
                });
            };

            /**
             * Use this function to set new active profile as local.
             */
            User.prototype.setActiveProfile = function( profile ){
                self.profile = profile.id;
            };

            User.prototype.getActiveProfile = function(){
                return self.profile;
            };

            /**
             *
             * @param id
             * @param value
             */
            User.prototype.setSetting = function( id, value ){
                self.settings[id] = value;
            };

            /**
             * @todo depend of the type we should return specific value here
             * @param id
             * @returns {*}
             */
            User.prototype.getSetting = function( id, defaultOtherwise ){
                var setting = self.settings[id];
                if( typeof setting !== 'undefined' && setting !== null ){
                    return self.settings[id];
                }
                else if (defaultOtherwise){
                    return APP_CONFIG.user.default.settings[id];
                }
                else{
                    return null;
                }
            };

            User.prototype.save = function(){
                var data = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    settings: user.settings,
                    backgroundImages: user.backgroundImages
                };
                return dataservice.updateAccount(data).then(function(user){
                    saveLocal();
                    return user;
                });
            };

            function saveLocal(){
                var data = {
                    profile: self.profile
                };
                localStorageService.set('user.' + self.id, data);
            }

            /**
             * Merge all local config into user logged.
             * - Check if local var are still valids. 
             */
            function mergeLocal(){
                var localUser = localStorageService.get('user.' + self.id);
                if(localUser && localUser.profile){
                    // reject if this id is not synchronized with server
                    if(self.profiles.indexOf(localUser.profile) !== -1){
                        self.profile = localUser.profile;
                    }
                }
            }
        };

        User.find = function(){

        };

        User.findOne = function(){

        };

        return User;
        
    }

})();