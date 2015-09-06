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

        /**
         * Build a user object that come will useful method.
         * This object represent logged user so there is only one.
         * SINGLETON
         */
        function userFactory(userService) {
            return new userService( userData );
        }
        userFactory.$inject = ['userService'];

    }

    userService.$inject = ['localStorageService', 'dataservice', 'APP_CONFIG'];
    function userService(localStorageService, dataservice, APP_CONFIG){

        /**
         *
         * @param data User data that come from server
         * @constructor
         */
        var User = function( data ){

            var self = this;

            // Copy data from server USER to the app user
            //self.profiles   = angular.copy(data.profiles);
            self.settings   = angular.copy(data.settings);
            self.id         = data.id;
            self.email      = data.email;
            self.backgroundImages = [];
            self.avatar     = data.avatar;
            self.banner     = data.banner;
            self.profile    = data.profile;
            self.firstName  = data.firstName;
            self.lastName   = data.lastName;
            self.job        = 'Developer';
            self.phone      = '(+33) 6 06 65 87 55';

            if(data.backgroundImages && Array.isArray(data.backgroundImages)){
                self.backgroundImages = angular.copy(data.backgroundImages);
            }

            // ----------------------------------------
            //
            // Merge local save of user with this current user
            //
            // ----------------------------------------
            mergeWithLocalSave();

            // ----------------------------------------
            //
            // Set default values when no save exist
            //
            // ----------------------------------------
            // no profile yet ? set the default
            if(!this.profile){
                localStorageService.set('noPreviousActiveProfile', true);
                this.profile = data.defaultProfile;
            }

            // ----------------------------------------
            //
            // Save new user to local storage
            //
            // ----------------------------------------
            saveUserToLocalStorage();

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
            this.setProfile = function( profile ){
                self.profile = profile.id;
            };

            this.getProfile = function(){
                return self.profile;
            };

            /**
             *
             * @param id
             * @param value
             */
            this.setSetting = function( id, value ){
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

            this.save = function(){
                var data = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    settings: user.settings,
                    backgroundImages: user.backgroundImages
                };
                return dataservice.updateAccount(data).then(function(user){
                    saveUserToLocalStorage();
                    return user;
                });
            };

            /**
             * Save the user to local storage.
             * In fact only save some data that are needed for the app when restarted
             * as active profile, etc.
             */
            function saveUserToLocalStorage(){
                var data = {
                    // Save active profile as it's the only way sto store that information for now
                    profile: self.profile
                };
                localStorageService.set('user.' + self.id, data);
            }

            /**
             * Merge the local user save with current user data.
             * We have to check for some values if they are still valid with server (maintain synchronization)
             */
            function mergeWithLocalSave(){
                var localData = localStorageService.get('user.' + self.id);
                if(localData !== null && !_.isUndefined(localData)){
                    _.assign(self, localData);
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