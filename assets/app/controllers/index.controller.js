(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('IndexController', IndexController)

    IndexController.$inject = ['$state', 'backstretch', 'user', '$scope', '$rootScope', '$q', 'APP_CONFIG', '$log', 'widgetService', 'geolocationService', 'modalService', 'notifService', '$timeout', 'sidebarService'];

    /**
     * IndexController
     *
     * IMPORTANT !!!!
     * Controllers should never do DOM manipulation or hold DOM selectors; that's where directives and using ng-model come in. Likewise business logic should live in services, not controllers.
     * Data should also be stored in services, except where it is being bound to the $scope
     */
    function IndexController($state, backstretch, user, $scope, $rootScope, $q, APP_CONFIG, $log, widgetService, geolocationService, modalService, notifService, $timeout, sidebarService){

        // This var will contain all widget element
        // These widgets will be placed inside iframe and get from server
        $scope.widgets = null;
        $scope.widgetsLocked = false;
        $scope.widgetsBorders = user.getSetting( user.CONST.SETTING_WIDGETS_BORDERS );
        var widgets;

        // This var save the previous widget state.
        // If widgets are moved then this var contain all widgets before this move
        var widgetsPreviousState = null;

        // backstretch take an array of url so we take settings
        // and create an array with image and url
        var urls = [];
        var bgImages = user.backgroundImages || APP_CONFIG.user.default.backgroundImages;
        angular.forEach(bgImages, function(image){
            urls.push(image);
        });
        $scope.backstretch = {
            duration: user.getSetting(user.CONST.SETTING_BACKGROUND_IMAGES_INTERVAL),
            images: urls
        };
        backstretch.resume();

        // We toggle backstretch state when toggling sidebar to reduce (graphical frame drop)
        $rootScope.$on('sidebar.open', function(){
            if($state.current.name === 'board') backstretch.pause();
        });
        $rootScope.$on('sidebar.opened', function(){
            if($state.current.name === 'board') backstretch.resume();
        });
        $rootScope.$on('sidebar.close', function(){
            if($state.current.name === 'board') backstretch.pause();
        });
        $rootScope.$on('sidebar.closed', function(){
            if($state.current.name === 'board') backstretch.resume();
        });

        // Function for menu button
        $scope.toggleMenu = function () {
            sidebarService.toggle();
        }
        $scope.refreshWidgets = function(){
            widgetService.sendSignal( null, 'refresh' );
        };
        $scope.stopWidgets = function(){
            widgetService.sendSignal( null /*widget*/, 'stop' /*signal*/);
        };
        $scope.startWidgets = function(){
            widgetService.sendSignal( null, 'start' );
        };
        $scope.reloadWidgets = function(){
            widgetService.reloadAll( widgets );
        };
        $scope.lockOrUnlock = function(){
            $scope.widgetsLocked = !$scope.widgetsLocked;
            if($scope.widgetsLocked){ }
            else{ }
        }

        /*
         * Widget load and init
         *
         * - Get widgets from server
         * - Transform the permissions array into filled object
         *
         */
        widgetService.getAll().then(function(widgets){

            widgets = widgets;
            $scope.widgets = widgets;

            return (function(){
                var deferred = $q.defer();

                $timeout(configureWidgets, 1000);

                return deferred.promise;

                function configureWidgets(){

                    // Loop over all widget and set required values
                    // some tasks may be async so we prepare promise loop
                    var promises = [];

                    angular.forEach(widgets, function(widget){

                        widget.state = 'loading';

                        // create promise and push it to run job later
                        promises.push(async());

                        function async(){
                            var deferred = $q.defer();

                            // =============================
                            // Fill permissions part
                            // permissions: ['email', 'location']
                            // =============================
                            var permissions = {
                                email: null,
                                location: null
                            };

                            // mail
                            if( widget.permissions &&  widget.permissions.indexOf('email') !== -1  ){
                                permissions.email = user.email;
                            }
                            // location (async)
                            // We create a new promise (with anonymous function)
                            (function(){
                                var deferred2 = $q.defer();
                                if( widget.permissions &&  widget.permissions.indexOf('location') !== -1 ){
                                    // get location using geoloc browser api
                                    widget.state = 'location';
                                    geolocationService.getLocation()
                                        .then(function(data){
                                            permissions.location = data.coords;
                                            deferred2.resolve();
                                        })
                                        .catch(function(err){
                                            $log.debug('User has not accepted location, permission is set to null');
                                            deferred2.reject(err);
                                        });
                                }
                                else{
                                    deferred2.resolve();
                                }
                                return deferred2.promise;

                            })().then(function(){
                                //console.log(widget);
                                widget.permissions = permissions; // @todo maybe not useful anymore

                                widgetService.load(widget);

                                return deferred.resolve();
                            })
                            .catch(function(err){
                                return deferred.reject(err);
                            });

                            return deferred.promise;
                        }

                    });

                    // Run loop job
                    // catch is handle by superior promise
                    $q.all(promises).then(function(){
                        return deferred.resolve();
                    }).catch(function(err){
                        return deferred.reject(err);
                    });
                }
            })();

        }).catch(function(error){
            // This catch handle error from all subsequent code
            // If error happens when set permission or promises loop for example
            modalService.simpleError(error.message);
        });

        /*
         * Gridster part
         *
         *
         */
        // Inject to view the gridster configuration
        $scope.gridsterOpts = APP_CONFIG.gridsterOpts;

        // Set event function when widgets are dragged
        $scope.gridsterOpts.draggable = {
            start: function(event, $element, widget){
                backstretch.pause();
            },
            stop: function(event, $element, widget) {
                backstretch.resume();
                widget.updateIfStateChanged();
            }
        };

        // Set event function when widgets are resized
        $scope.gridsterOpts.resizable = {
            start: function(event, $element, widget){
                backstretch.pause();
            },
            stop: function(event, $element, widget) {
                backstretch.resume();
                widget.updateIfStateChanged();
            }
        };

        // When the window change and gridster has been resized in order to be displayed
        $scope.$on('gridster-resized', function(event, size){

        });
        // Watch item changes
        // @todo this event is triggered at startup, I suspect its due to the page building which make gridster change during process
        // @todo maybe use a queue here to store change and call server less times
        $scope.$watch('widgets', function(newWidgets){


        }, true);


    };
})();
