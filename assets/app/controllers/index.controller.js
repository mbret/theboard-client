(function () {
    'use strict';

    angular
        .module('app.controllers')
        .controller('IndexController', IndexController)

    /**
     * IndexController
     *
     * IMPORTANT !!!!
     * Controllers should never do DOM manipulation or hold DOM selectors; that's where directives and using ng-model come in. Likewise business logic should live in services, not controllers.
     * Data should also be stored in services, except where it is being bound to the $scope
     */
    function IndexController(dataservice, backstretch, user, $scope, $rootScope, APP_CONFIG, widgetService, modalService, notifService, $timeout, sidebarService, gridsterConfig, fullscreenService){

        var widgets;

        // This var will contain all widget element
        // These widgets will be placed inside iframe and get from server
        $scope.widgets          = null;
        $scope.widgetsLocked    = false;
        $scope.widgetsBorders   = user.getSettingValue( user.SETTING_WIDGETS_BORDERS, true );

        // Method to execute when fullscreen mode
        $scope.onFullscreen     = onFullscreen;

        // Used by view to know if we are currently in fullscreen mode
        $scope.isFullscreen     = false;

        // -----------------------------------------------
        //
        //      Backstretch part
        //
        // -----------------------------------------------
        // backstretch take an array of url so we take settings
        // and create an array with image and url
        var bgImages = user.getSettingValue(user.SETTING_BACKGROUND_IMAGES);
        var baseUrl  = user.hasSetting(user.SETTING_BACKGROUND_IMAGES) ? APP_CONFIG.baseUrls.public + '/' : APP_CONFIG.baseUrls.backgroundImages + '/';
        $scope.backstretch = {
            duration: user.getSettingValue(user.SETTING_BACKGROUND_IMAGES_INTERVAL, true),
            images: bgImages.map(function(image){
                return baseUrl + image;
            })
        };

        // Start backstretch
        backstretch.resume();

        // We toggle backstretch state when toggling sidebar to reduce (graphical frame drop)
        $rootScope.$on(sidebarService.EVENTS.OPEN, backstretch.pause);
        $rootScope.$on(sidebarService.EVENTS.OPENED, backstretch.resume);
        $rootScope.$on(sidebarService.EVENTS.CLOSE, backstretch.pause);
        $rootScope.$on(sidebarService.EVENTS.CLOSE, backstretch.resume);

        // Function for menu button
        $scope.toggleMenu       = function(){
            sidebarService.toggle();
        };

        // -----------------------------------------------
        //
        //      Widget load
        // - Get widgets from server
        // - Transform the permissions array into filled object
        //
        // -----------------------------------------------
        widgetService
            .getAll(user.getProfile())
            .then(function(widgetsFromServer){

                // keep data locally
                widgets = widgetsFromServer;
                $scope.widgets = widgets;

                return new Promise(function(resolve, reject){

                    $timeout(function(){

                        // Loop over all widget and set required values
                        // some tasks may be async so we prepare promise loop
                        var promises = [];

                        angular.forEach(widgets, function(widget){
                            promises.push(widget.load());
                        });

                        // Run loop job
                        // catch is handle by superior promise
                        Promise.all(promises)
                            .then(resolve)
                            .catch(reject);
                    }, 1000);

                });
            })
            // This catch handle error from all subsequent code
            // If error happens when set permission or promises loop for example
            .catch(modalService.simpleError);

        $scope.reloadWidgets    = function(){
            widgetService.reloadAll(widgets);
        };
        $scope.lockOrUnlock     = function(){
            $scope.widgetsLocked = !$scope.widgetsLocked;
            if($scope.widgetsLocked){ }
            else{ }
        };

        // -----------------------------------------------
        //
        //      Gridster part
        //
        // -----------------------------------------------

        // Set event function when widgets are dragged
        gridsterConfig.draggable.start = function(event, $element, widget){
            backstretch.pause();
        };

        gridsterConfig.draggable.stop = function(event, $element, widget) {
            backstretch.resume();

            widget.saveLocation(user.getProfile())
                .then(function(){
                    notifService.success( APP_CONFIG.messages.success.widget.updated );
                });
        };

        // Set event function when widgets are resized
        gridsterConfig.resizable.start = function(event, $element, widget){
            backstretch.pause();
        };

        gridsterConfig.resizable.stop = function(event, $element, widget) {
            backstretch.resume();

            widget.saveSize(user.getProfile())
                .then(function(){
                    notifService.success( APP_CONFIG.messages.success.widget.updated );
                });
        };

        // When the window change and gridster has been resized in order to be displayed
        $scope.$on('gridster-resized', function(event, size){

        });

        // Watch item changes
        // @todo this event is triggered at startup, I suspect its due to the page building which make gridster change during process
        // @todo maybe use a queue here to store change and call server less times
        // @todo DO NOT USE IN THIS STATE this method cause fatal loop
        //$scope.$watch('widgets', function(newWidgets){
        //
        //
        //}, true);

        /**
         * Tell the view that we are in fullscreen mode with $scope.fullscreen
         * @param event
         */
        function onFullscreen(event){
            var maxHeight = window.screen.height,
                maxWidth = window.screen.width,
                curHeight = window.innerHeight,
                curWidth = window.innerWidth;
            if (maxWidth == curWidth && maxHeight == curHeight) {
                alert('f');
                $scope.isFullscreen = true;
            }
            else{
                $scope.isFullscreen = false;
            }
        }

    };
})();
