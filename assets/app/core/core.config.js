(function () {
    'use strict';

    var app = angular.module('app')
        .config(configureConfig)
        .config(configureToastr)
        .config(configureProviders)
        .config(configureBlocks)
        .run(appRun);

    // Configure tha config from server
    // We add some info here
    configureConfig.$inject = ['config', '_'];
    function configureConfig(config, _){
        // deep merge
        _.merge(config, {
            appErrorPrefix: '[Board] ',
            routes: {
                templates: config.routes.app + '/views/templates',
                partials: config.routes.app + '/views/partials'
            }
        });
    }

    // Toaster configuration
    // The configuration come from the server
    configureToastr.$inject = ['toastr', 'config'];
    function configureToastr(toastr, config) {
        angular.extend(toastr.options, config.toastr);
    }

    // Register various providers
    configureProviders.$inject = ['$httpProvider'];
    function configureProviders($httpProvider) {
        $httpProvider.interceptors.push('myHttpInterceptor');
    };

    // Configure various blocks
    // Blocks are reusable component through different application
    // They usually give a 'provider' because these blocks can be configured
    // and expose an API for application-wide configuration that must be made before the application starts
    configureBlocks.$inject = ['exceptionHandlerProvider', 'config'];
    function configureBlocks(exceptionHandlerProvider, config){
        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }
    
    // Config that must be execute at module run
    appRun.$inject = ['$rootScope', '$state', '$http', '$log', 'notifService', '$timeout', 'config'];
    function appRun($rootScope, $state, $http, $log, notifService, $timeout, config){

        $rootScope.$state = $state;

        // Check for flash message from server
        // These message can come from login/logout/etc
        // We display it after Pace is hidden.
        // @todo if you have a better idea in order to not use directly Pace here give it
        Pace.on('hide', function(){
            $http.get(config.routes.flash).then(function(data){
                $log.debug(data.data);
                var messages = data.data;

                if(messages.errors){
                    notifService.error(messages.errors)
                }
                if(messages.warnings){
                    notifService.warning(messages.warnings)
                }
                if(messages.success){
                    notifService.success(messages.success)
                }
                if(messages.info){
                    notifService.info(messages.info)
                }
            });
        });

    };

})();
