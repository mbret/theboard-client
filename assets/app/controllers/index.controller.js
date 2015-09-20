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
    function IndexController(dataservice, backstretch, user, $scope, $rootScope, APP_CONFIG, widgetService, modalService, notifService, $timeout, sidebarService, gridsterConfig){

        // This var will contain all widget element
        // These widgets will be placed inside iframe and get from server
        $scope.widgets          = null;
        $scope.widgetsLocked    = false;
        $scope.widgetsBorders   = user.getSetting( user.SETTING_WIDGETS_BORDERS, true );
        $scope.hideButtonsBar   = false;
        var widgets;

        // This var save the previous widget state.
        // If widgets are moved then this var contain all widgets before this move
        var widgetsPreviousState = null;

        // backstretch take an array of url so we take settings
        // and create an array with image and url
        var bgImages = user.getSetting( user.SETTING_BACKGROUND_IMAGES );
        var urls = bgImages.map(function(image){
            return APP_CONFIG.baseUrls.backgroundImages + '/' + image;
        });

        $scope.backstretch = {
            duration: user.getSetting(user.SETTING_BACKGROUND_IMAGES_INTERVAL, true),
            images: urls
        };
        backstretch.resume();

        // @todo utiliser :fulscreen css
        function onFullScreen(event) {
            var maxHeight = window.screen.height,
                maxWidth = window.screen.width,
                curHeight = window.innerHeight,
                curWidth = window.innerWidth;
            if (maxWidth == curWidth && maxHeight == curHeight) {
                $scope.hideButtonsBar = true;
            }
            else{
                $scope.hideButtonsBar = false;
            }
        }
        angular.element(window).on('resize', onFullScreen);
        $scope.$on('$destroy', function(){
            angular.element(window).off('resize', onFullScreen);
        });

        // We toggle backstretch state when toggling sidebar to reduce (graphical frame drop)
        $rootScope.$on('sidebar.open', function(){
            backstretch.pause();
        });
        $rootScope.$on('sidebar.opened', function(){
            backstretch.resume();
        });
        $rootScope.$on('sidebar.close', function(){
            backstretch.pause();
        });
        $rootScope.$on('sidebar.closed', function(){
            backstretch.resume();
        });

        // Function for menu button
        $scope.toggleMenu = function () {
            sidebarService.toggle();
        };
        $scope.refreshWidgets = function(){
            widgetService.sendSignal( widgets, widgetService.SIGNAL_REFRESH );
        };
        $scope.stopWidgets = function(){
            widgetService.sendSignal( widgets, widgetService.SIGNAL_STOP );
        };
        $scope.startWidgets = function(){
            widgetService.sendSignal( widgets, widgetService.SIGNAL_START );
        };
        $scope.reloadWidgets = function(){
            widgetService.reloadAll(widgets);
        };
        $scope.lockOrUnlock = function(){
            $scope.widgetsLocked = !$scope.widgetsLocked;
            if($scope.widgetsLocked){ }
            else{ }
        };

        /* --------------------------------------------------------------
         *
         *                  Widget load and init
         *
         * - Get widgets from server
         * - Transform the permissions array into filled object
         * --------------------------------------------------------------*/
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

        /* --------------------------------------------------------------
         *
         *                  Gridster part
         *
         * --------------------------------------------------------------*/

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

        console.log(gridsterConfig);
        // Watch item changes
        // @todo this event is triggered at startup, I suspect its due to the page building which make gridster change during process
        // @todo maybe use a queue here to store change and call server less times
        // @todo DO NOT USE IN THIS STATE this method cause fatal loop
        //$scope.$watch('widgets', function(newWidgets){
        //
        //
        //}, true);


    };
})();
