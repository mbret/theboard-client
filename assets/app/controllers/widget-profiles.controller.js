(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('WidgetProfilesController', WidgetProfilesController)
        .controller('WidgetProfilesDetailController', WidgetProfilesDetailController);

    /**
     *
     */
    WidgetProfilesController.$inject = ['APP_CONFIG', '$uibModal', 'widgetProfilesService', 'notifService', 'user', '$state', 'userService'];
    function WidgetProfilesController(APP_CONFIG, $modal, widgetProfilesService, notifService, user, $state, userService){

        var that = this;
        var vm = this; // view model
        vm.profiles = [];
        
        widgetProfilesService.getAll().then(function(profiles){
            vm.profiles = profiles;
        });

        this.isActive = function(profile){
            return user.getProfile() === profile.id ? true : false;
        };
        
        this.detail = function(profile){
            $state.go('static.widgetProfilesDetail', {id:profile.id});
        };
        
        /**
         * Create a new profile.
         */
        this.newProfile = function(){
            $modal.open({
                templateUrl: APP_CONFIG.routes.templates + '/modals/widget-profile.new.html',
                controller: ModalNewWidgetCtl,
                controllerAs: 'modalNewWidgetCtl',
                resolve: {
                    profiles: function(){
                        return vm.profiles;
                    }
                }
            })
            .result
            .then(function(profile){
                    vm.profiles.push(profile);
            });
        };

        /**
         * Activate a profile
         * @param profile
         */
        this.activate = function(event, profile){
            // We stop propagation because there are ng-click on parent elt
            event.stopPropagation();

            // save for user and for session
            user.setProfile(profile);
            user.save().then(function(user){
                notifService.success(APP_CONFIG.messages.profile.activated);
            });
        };
        
        this.setAsDefault = function(event, profile){
            // We stop propagation because there are ng-click on parent elt
            event.stopPropagation();
            widgetProfilesService.update({
                id: profile.id,
                default: true
            }).then(function(profileUpdated){

                // Update view
                angular.forEach(vm.profiles, function(profile){
                    if( profile.default ) profile.default = false;
                });
                profile.default = true;
                
                notifService.success(APP_CONFIG.messages.profile.updated);
            });
            
        };

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
    WidgetProfilesDetailController.$inject = ['$stateParams', 'widgetProfilesService', '$state'];
    function WidgetProfilesDetailController($stateParams, widgetProfilesService, $state){
        var id = $stateParams.id;

        var self = this;
        self.profile;
        
        // Get profile from server
        // In case of error redirect to profiles (user could put shit in url)
        widgetProfilesService.get(id)
            .then(function(profile){
                self.profile = profile;
            })
            .catch(function(err){
                $state.go('static.widgetProfiles');
            })
    }

    /**
     *
     * @constructor
     */
    ModalNewWidgetCtl.$inject = ['$scope', '$modalInstance' , 'profiles', 'notifService', 'APP_CONFIG', 'widgetProfilesService'];
    function ModalNewWidgetCtl ($scope, $modalInstance, profiles, notifService, APP_CONFIG, widgetProfilesService) {

        var self = this;
        
        $scope.ok = function (profile) {
            $modalInstance.close(profile);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        /**
         * Form.
         * This form take into account click on button ok and enter key
         * @todo add test for name already exist (use profiles resolved)
         * @param isValid
         */
        $scope.submitForm = function(form) {

            if (form.$valid) {
                widgetProfilesService.create({
                    name: $scope.profile.name,
                    description: $scope.profile.description
                }).then(function(profile){
                    notifService.success( APP_CONFIG.messages.profile.created );
                    $scope.ok(profile);
                });
            }
            else{
                form.name.$setDirty();
                notifService.error( APP_CONFIG.messages.form.invalid );
            }
        };
    };
    
    /**
     * Modal that handle the profile settings
     * The modal take a profile from resolve and return the updated profile.
     * The profile is directly updated if success. No need to treat the modal result.
     * @constructor
     */
    ModalInstanceCtrl.$inject = ['$scope', '$modalInstance' ,'profile', 'notifService', 'APP_CONFIG', 'widgetProfilesService'];
    function ModalInstanceCtrl ($scope, $modalInstance, profile, notifService, APP_CONFIG, widgetProfilesService) {
        
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
                    widgetProfilesService.update({
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