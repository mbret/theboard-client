(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app.services')

        // "User" is the base object used to instantiate "user".
        .factory('User', UserFactory);

    function UserFactory(localStorageService, APP_CONFIG){
        /**
         *
         * @param data
         * @constructor
         */
        function User(data){
            var self = this;

            // Copy data from server USER to the app user
            //self.profiles   = angular.copy(data.profiles);
            var settings   = angular.copy(data.settings);
            self.id         = data.id;
            self.email      = data.email;
            //self.backgroundImages = [];
            var avatar     = data.avatar;
            var banner     = data.banner;
            self.profile    = data.profile;
            self.firstName  = data.firstName;
            self.lastName   = data.lastName;
            self.job        = 'Developer';
            self.phone      = '(+33) 6 06 65 87 55';

            //if(data.backgroundImages && Array.isArray(data.backgroundImages)){
            //    self.backgroundImages = angular.copy(data.backgroundImages);
            //}

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
            User.prototype.SETTING_WIDGETS_BORDERS              = 'widgetsBorders';
            User.prototype.SETTING_BACKGROUND_IMAGES_INTERVAL   = 'backgroundImagesInterval';
            User.prototype.SETTING_BACKGROUND_IMAGES            = 'backgroundImages';
            User.prototype.SETTING_BACKGROUND                   = 'background';

            //User.prototype.addBackgroundImage = function( key ){
            //    self.backgroundImages.push(key);
            //};

            //User.prototype.removeBackgroundImage = function( key ){
            //    self.backgroundImages = _.remove(self.backgroundImages, function(n) {
            //        return key !== n;
            //    });
            //};

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
            //this.setSetting = function( id, value ){
            //    self.settings[id] = value;
            //};

            /**
             * @todo depend of the type we should return specific value here
             * @param id
             * @returns {*}
             */
            this.getSettingValue = function( resource, defaultValue ){

                // search for setting
                var settingFound = _getSetting(resource);

                // If setting is not found fallback to default one
                if(settingFound === null){
                    settingFound = _getDefaultSetting(resource);
                }

                console.log('setting:', resource, settingFound);
                return settingFound.value;

            };

            this.hasSetting = function(resource){
                return _getSetting(resource) !== null;
            };

            /**
             * Will replace (or create) a complete setting.
             * @param resource
             * @param setting
             */
            this.setSetting = function(resource, setting){
                if(!setting.name || !setting.value || !setting.type || !setting.profile){
                    throw new Error('Invalid setting trying to be set to user :' + JSON.stringify(setting));
                }

                // Check if setting exist
                var settingFound = _getSetting(resource);

                // If exist only update value
                if(settingFound !== null){
                    settingFound.value = setting.value;
                }
                // Otherwise add the setting to user
                else{
                    settings.push({
                        name: setting.name,
                        value: setting.value,
                        profile: setting.profile.id || setting.profile,
                        type: setting.type
                    });
                }
            };
            //this.setSettingValue = function(resource, value){
            //
            //    // Get setting first
            //    var setting = _getSetting(resource);
            //
            //    // Not set yet, we have to create it
            //    if(setting === null){
            //
            //    }
            //};

            // user.backgroundImages.length > 0) ? user.backgroundImages : APP_CONFIG.user.default.backgroundImages;

            this.save = function(){
                var data = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    settings: user.settings,
                    //backgroundImages: user.backgroundImages
                };
                return dataservice.updateAccount(data).then(function(user){
                    saveUserToLocalStorage();
                    return user;
                });
            };

            this.getAvatar = function(){
                return APP_CONFIG.baseUrls.images + '/' + avatar;
            };

            this.getBanner = function(){
                return APP_CONFIG.baseUrls.images + '/' + banner;
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

            /**
             * Retrieve default user setting.
             * The setting must exist
             * @param resource
             * @returns {*}
             * @private
             */
            function _getDefaultSetting(resource){

                // search for setting
                var found = _.find(APP_CONFIG.defaultUserSettings, 'name', resource);
                if(_.isUndefined(found)){
                    throw new Error('No default setting found for ' + resource);
                }
                return found;

            }

            function _getSetting(resource){
                // search for setting
                var settingFound = _.find(settings, 'name', resource);
                if(_.isUndefined(settingFound)){
                    return null;
                }
                return settingFound;
            }
        }
        return User;
    }




})();