(function () {
    'use strict';

    angular.module('app.core')
        .config(configureToastr)
        .config(configureProviders)
        .config(configureBlocks)
        .config(configureUser)
        .run(appRun);

    // Toaster configuration
    // The configuration come from the server
    configureToastr.$inject = ['toastr', 'APP_CONFIG'];
    function configureToastr(toastr, APP_CONFIG) {
        angular.extend(toastr.options, APP_CONFIG.toastr);
    }

    // Register various providers
    configureProviders.$inject = ['$httpProvider'];
    function configureProviders($httpProvider) {
        $httpProvider.interceptors.push('myHttpInterceptor');
    }

    // Configure various blocks
    // Blocks are reusable component through different application
    // They usually give a 'provider' because these blocks can be configured
    // and expose an API for application-wide configuration that must be made before the application starts
    configureBlocks.$inject = ['exceptionHandlerProvider', 'APP_CONFIG'];
    function configureBlocks(exceptionHandlerProvider, APP_CONFIG){
        exceptionHandlerProvider.configure(APP_CONFIG.appErrorPrefix);
    }

    configureUser.$inject = ['APP_CONFIG', 'userProvider', '$provide'];
    /**
     * Configure the user value for all application.
     * The user object come from server and correspond to the logged user.
     * This value is set now but can change anytime during process and is share accross modules.
     */
    function configureUser(APP_CONFIG, userProvider, $provide){
        userProvider.setData(APP_CONFIG.userLogged);
        //var user = new userService(APP_CONFIG.userLogged);
        //$provide.value('user', user);
    }

    // Config that must be execute at module run
    appRun.$inject = ['$rootScope', '$state', '$http', '$log', 'notifService', 'userService', 'APP_CONFIG', 'user'];
    function appRun($rootScope, $state, $http, $log, notifService, userService, APP_CONFIG, user){

        window.user = user;

        $rootScope.$state = $state;

        // Check for flash message from server
        // These message can come from login/logout/etc
        // We display it after Pace is hidden.
        // @todo if you have a better idea in order to not use directly Pace here give it
        Pace.on('hide', function(){
            $http.get(APP_CONFIG.routes.flash).then(function(data){
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
