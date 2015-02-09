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

        userFactory.$inject = ['_', '$injector', 'userService'];
        /**
         * Build a user object that come will useful method.
         * This object represent logged user so there is only one.
         * SINGLETON
         */
        function userFactory(_, $injector, userService) {

            var User = function( data ){

                /*
                 * Attributes
                 */
                this.profiles = angular.copy(data.profiles);
                // array of settings with their values
                this.settings = angular.copy(data.settings);
                this.id = data.id;
                this.email = data.email;
                this.backgroundImages = angular.copy(data.backgroundImages);
                this.backgroundImagesInterval = data.backgroundImagesInterval;
                this.avatar = data.avatar;
                this.banner = data.banner;
                this.profile = data.profile;
                this.firstName = data.firstName;
                this.lastName = data.lastName;

                /*
                 * Constants
                 * constants are here to reduce the use of potentially future changed strings.
                 * Use them inside controller etc and change only here when server changed. 
                 */
                User.prototype.CONST = {
                    SETTING_WIDGETS_BORDERS : 'widgetsBorders'
                }
                
                /*
                 * Methods
                 */
                /**
                 * Use this function to set new active profile as local.
                 */
                User.prototype.setActiveProfile = function( id ){
                    this.profile = id;
                }

                /**
                 *  
                 * @returns {*}
                 */
                User.prototype.save = function(){
                    var data = {
                        firstName: this.firstName,
                        lastName: this.lastName,
                        settings: this.settings
                    };
                    return userService.update( data );
                }

                /**
                 *
                 * @param id
                 * @param value
                 */
                User.prototype.setSetting = function( id, value ){
                    this.settings[id] = value;
                }

                /**
                 * @todo depend of the type we should return specific value here
                 * @param id
                 * @returns {*}
                 */
                User.prototype.getSetting = function( id ){
                    return this.settings[id];
                }
            };

            return new User( userData );
        }
    }

})();