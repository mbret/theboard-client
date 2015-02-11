(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('WidgetProfilesController', WidgetProfilesController)
        .controller('WidgetProfilesDetailController', WidgetProfilesDetailController);

    /**
     *
     */
    WidgetProfilesController.$inject = ['APP_CONFIG', '$modal', 'profilesService', 'notifService', 'user', '$state'];
    function WidgetProfilesController(APP_CONFIG, $modal, profilesService, notifService, user, $state){

        var that = this;
        var vm = this; // view model
        vm.profiles = [];

        profilesService.getAll().then(function(profiles){
            angular.forEach(profiles, function(profile){
                vm.profiles.push({
                    id: profile.id,
                    name: profile.name,
                    createdAt: profile.createdAt,
                    widgets: profile.widgets,
                    description: profile.description,
                    selected: (user.profile) ? ((user.profile === profile.id) ? profile.id : false) : profile.default
                });
            });
        });

        this.detail = function(profile){
            $state.go('widget-profiles-detail', {id:profile.id});
        }
        
        /**
         * Create a new profile.
         */
        this.newProfile = function(){
            notifService.success("Profile created");
        }

        /**
         * Activate a profile
         * @param profile
         */
        this.activate = function(event, profile){
            // We stop propagation because there are ng-click on parent elt
            event.stopPropagation();
            
            profilesService.update({
                id: profile.id,
                activate: true
            }).then(function(profileUpdated){
               
                // Update view
                angular.forEach(vm.profiles, function(profile){
                    if( profile.selected ) profile.selected = false;
                });
                profile.selected = true;
                
                user.setActiveProfile(profileUpdated.id);

                notifService.success(APP_CONFIG.messages.profile.activated);
            });
        }

        /**
         * Display the settings modal
         * The modal will update the profile passed via resolve itself. No need to check modal results.
         * @param profile
         */
        this.configure = function(event, profile){
            // We stop propagation because there are ng-click on parent elt
            event.stopPropagation();
            
            $modal.open({
                templateUrl: APP_CONFIG.routes.templates + '/modals/widget-profile-settings.html',
                controller: ModalInstanceCtrl,
                controllerAs: 'modalInstanceCtrl',
                resolve: {
                    profile: function(){
                        return profile;
                    }
                }
            });
        }

    };

    /**
     *  https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views
     */
    WidgetProfilesDetailController.$inject = ['$stateParams', 'profilesService', '$state'];
    function WidgetProfilesDetailController($stateParams, profilesService, $state){
        var id = $stateParams.id;

        var self = this;
        self.profile;
        
        // Get profile from server
        // In case of error redirect to profiles (user could put shit in url)
        profilesService.get(id)
            .then(function(profile){
                self.profile = profile;
            })
            .catch(function(err){
                $state.go('widget-profiles');
            })
    }
    
    /**
     * Modal that handle the profile settings
     * The modal take a profile from resolve and return the updated profile.
     * The profile is directly updated if success. No need to treat the modal result.
     * @constructor
     */
    ModalInstanceCtrl.$inject = ['$scope', '$modalInstance' ,'profile', 'notifService', 'APP_CONFIG', 'profilesService'];
    function ModalInstanceCtrl ($scope, $modalInstance, profile, notifService, APP_CONFIG, profilesService) {
        
        var that = this;
        that.profile = {
            name: profile.name,
            description: profile.description
        };
        
        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        
        
        /**
         * Form.
         * This form take into account click on button ok and enter key
         * @param isValid
         */
        $scope.submitForm = function(isValid) {

            if (isValid) {
                
                if( profile.name === that.profile.name && profile.description === that.profile.description ){
                    return noChanges();
                }
                else{
                    profilesService.update({
                        id: profile.id,
                        name: that.profile.name,
                        description: that.profile.description
                    }).then(function(profileUpdated){
                        profile.name = profileUpdated.name;
                        profile.description = profileUpdated.description;
                        notifService.success( APP_CONFIG.messages.profile.updated );
                        updated();
                    });
                }
            }
            else{
                notifService.error( APP_CONFIG.messages.form.invalid );
            }
            
            // Close the modal with no changes
            function noChanges(){
                notifService.info( APP_CONFIG.messages.nochange );
                $scope.ok();
            }
            
            // Close the modal after success update
            function updated(){
                $scope.ok();
            }

        };
    };
    
})();