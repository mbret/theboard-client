(function () {
    'use strict';


    angular
        .module('app')
        .factory('widgetProfilesService', widgetProfilesService);

    widgetProfilesService.$inject = ['dataservice', 'localStorageService', 'user'];

    function widgetProfilesService(dataservice, localStorageService, user) {

        return {
            update: update,
            getAll: getAll,
            get: get,
            saveActiveProfile: saveActiveProfile,
            create: create
        };

        function getAll(){
            return dataservice.getProfiles();
        }

        function update(profile){
            return dataservice.updateProfile(profile);
        }

        function get(id){
            return dataservice.getProfile(id);
        }
        
        function create(profile){
            return dataservice.createProfile(profile);
        }

        function saveActiveProfile(profile){
            localStorageService.set('profile', profile);
            
        }
    }

})();