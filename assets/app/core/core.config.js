(function () {
    'use strict';

    angular.module('app.core')
        /**
         * get executed during the provider registrations and configuration phase.
         * Only providers and constants can be injected into configuration blocks.
         * This is to prevent accidental instantiation of services before they have been fully configured.
         *
         * @alias:
         * value('a', 123).
         * factory('a', function() { return 123; }).
         * directive('directiveName', ...).
         * filter('filterName', ...);
         */
        .config(configureToastr)
        .config(configureProviders)
        .config(configureBlocks)
        .config(configureLocalStorage)
        .config(configureUser)
        .config(configureAppConfig)
        .config(configureGridster)
        /**
         *  get executed after the injector is created and are used to kickstart the application.
         *  Only instances and constants can be injected into run blocks.
         *  This is to prevent further system configuration during application run time.
         *
         *  - It's possible to get constant from includer module
         */
        .run(run);

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

    function configureLocalStorage(localStorageServiceProvider){
        localStorageServiceProvider
            .setPrefix('app.')
            .setStorageType('localStorage')
            .setNotify(true, true);
    }

    /**
     * Configure the user value for all application.
     * The user object come from server and correspond to the logged user.
     * This value is set now but can change anytime during process and is share accross modules.
     */
    function configureUser(USER, $provide){
        $provide.factory('user', function(User){
           return new User(USER);
        });
    }

    /**
     * config get injected by 'app' as a constant when config is retrieved from server
     */
    function configureAppConfig(APP_CONFIG, _){

        // deep merge
        _.merge(APP_CONFIG, {
            appErrorPrefix: '[Board: Error] ',
            routes: {
                templates: APP_CONFIG.routes.views + '/templates',
                partials: APP_CONFIG.routes.views + '/partials'
            },
            gridsterOpts: {
                columns: 6, // the width of the grid, in columns
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 300, // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                margins: [20, 20], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid,
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                resizable: {
                    enabled: true,
                    handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                    start: function(event, $element, widget) {}, // optional callback fired when resize is started,
                    resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
                    stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    handle: '.gridster-draggable', // optional selector for resize handle
                    start: function(event, $element, widget) {}, // optional callback fired when drag is started,
                    drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
                    stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
                }
            }
        });
    }

    function configureGridster(gridsterConfig, APP_CONFIG, _){
        _.merge(gridsterConfig, APP_CONFIG.gridsterOpts);
    }

    /**
     *
     * @param $rootScope
     * @param $state
     * @param $http
     * @param $log
     * @param notifService
     * @param userService
     * @param APP_CONFIG
     * @param user
     */
    function run($rootScope, $state, $http, $log, notifService, APP_CONFIG, $timeout, USER, localStorageService, $modal, user){

        $log.info('APP_CONFIG', APP_CONFIG);
        $log.info('USER', USER);
        $log.info('app user', user);

        // We pass $state to the view because $state object seems not to be accessible otherwise
        // This is used for example in app.ejs to ste current target as style=""
        $rootScope.$state = $state;

        // Listen for localStorage change
        $rootScope.$on('LocalStorageModule.notification.setitem', function(e, object){
            $log.info('LocalStorageModule.notification.setitem', object);
        });
        $rootScope.$on('LocalStorageModule.notification.removeitem', function(e, object){
            $log.info('LocalStorageModule.notification.removeitem', object);
        });

        // Wait for pace hide event, Once this event is emitted pace is normally hidden
        // and the dom is ready for use
        Pace.once('hide', function(){

            // Wait 1 second more to be sure pace disappeared
            $timeout(function(){

                // Check for active profile for user.
                // If no profile is set yet, tell to user that we use default profile.
                if(localStorageService.get('noPreviousActiveProfile') === true){
                    localStorageService.remove('noPreviousActiveProfile');
                    $modal.open({
                        templateUrl: APP_CONFIG.routes.templates + '/modals/default-profile-selected.html',
                        controller: function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close($scope);
                            };
                        }
                    });
                }

                if(!"sandbox" in document.createElement("iframe")){
                    alert("We are sorry but your browser is too old and unsafe. Your widgets will not be loaded in order to protect you.");
                }

                notifService.watchForServerFlashMessage();


            }, 1000);

        });

        $state.go('static.repository');

    };

})();
