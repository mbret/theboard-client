(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app.services')
        .provider('user', userProvider)

    function userProvider(){
        
        var userData;
        
        return {
            setData: setData,
            $get: userFactory
        }

        /**
         * Set the data that will be used to build the user.
         * Typically it comes from server
         * @param data
         */
        function setData( data ){
            userData = data;
        }

        userFactory.$inject = ['_', '$injector', 'dataservice'];
        /**
         * Build a user object that come will useful method.
         * This object represent logged user so there is only one.
         * SINGLETON
         */
        function userFactory(_, $injector, dataservice) {

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
                self.backgroundImages = angular.copy(data.backgroundImages);
                self.avatar = data.avatar;
                self.banner = data.banner;
                self.profile = data.profile;
                self.firstName = data.firstName;
                self.lastName = data.lastName;

                /*
                 * Constants
                 * constants are here to reduce the use of potentially future changed strings.
                 * Use them inside controller etc and change only here when server changed. 
                 */
                User.prototype.CONST = {
                    SETTING_WIDGETS_BORDERS : 'widgetsBorders',
                    SETTING_BACKGROUND_IMAGES_INTERVAL : 'backgroundImagesInterval'
                };
                
                User.prototype.addBackgroundImage = function( key ){
                    self.backgroundImages.push(key);
                };
                
                User.prototype.removeBackgroundImage = function( key ){
                    self.backgroundImages = _.remove(self.backgroundImages, function(n) {
                        return key !== n;
                    });
                    console.log(self.backgroundImages);
                };
                
                /**
                 * Use this function to set new active profile as local.
                 */
                User.prototype.setActiveProfile = function( id ){
                    self.profile = id;
                };

                /**
                 *  
                 * @returns {*}
                 */
                User.prototype.save = function(){
                    var data = {
                        firstName: self.firstName,
                        lastName: self.lastName,
                        settings: self.settings,
                        backgroundImages: self.backgroundImages
                    };
                    return dataservice.updateAccount(data);
                }

                /**
                 *
                 * @param id
                 * @param value
                 */
                User.prototype.setSetting = function( id, value ){
                    self.settings[id] = value;
                }

                /**
                 * @todo depend of the type we should return specific value here
                 * @param id
                 * @returns {*}
                 */
                User.prototype.getSetting = function( id ){
                    return self.settings[id];
                }
            };

            return new User( userData );
        }
    }

})();