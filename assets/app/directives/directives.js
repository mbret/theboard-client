'use strict';

/**
 * Directives can be used to:
 * - create a custom button my-button which has some event listener ...
 *      ex: http://twofuckingdevelopers.com/2014/06/angularjs-best-practices-001-constants/
 *
 * - Directives can get constant vars to help manage events, etc without typo problem
 *  ex: http://twofuckingdevelopers.com/2014/06/angularjs-best-practices-001-constants/
 */

angular
    .module('app.directives')

    /**
     * Use declarative approach
     * Use it with <title page-title></title>
     */
    .directive('pageTitle', ['$rootScope', '$timeout', 'config',
        function($rootScope, $timeout, config){
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    var listener = function(event, toState, toParams, fromState, fromParams) {
                        // Default title - load on Dashboard 1
                        var title = config.pageTitle + ' | Home';
                        // Create your own title pattern
                        if (toState.data && toState.pageTitle) title = config.pageTitle + ' | ' + toState.data.pageTitle;
                        $timeout(function() {
                            element.text(title);
                        });
                    };
                    // @todo take the best one
                    $rootScope.$on('$stateChangeStart', listener);
                    //$rootScope.$on('$stateChangeSuccess', listener);
                }
            }
        }
    ])

    /**
     * Control the sidebar component
     * For now it only reset the state when route change. In that way the sidebar is always reset when user leave the /board state
     */
    .directive('sidebar', ['$rootScope', '$timeout', 'config', 'sidebarService',
        function($rootScope, $timeout, config, sidebarService){
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    
                    // get eventual attribute 
                    // sidebar-close="" define who whant a sidebar closed at state change
                    var stateWhoWhantSidebarClosed = attrs.sidebarClose;
                    
                    // Reset sidebar when the route is changed
                    //
                    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                        if(toState.name == stateWhoWhantSidebarClosed){
                            sidebarService.close();
                        }
                        else{
                            sidebarService.putStatic(); // put static (disable backdrop)
                        }
                    });
                }
            }
        }
    ])

    /**
     * Apply the plugin metis menu to the element that have the directive
     * (in our app it come to the sidebar ul)
     */
    .directive('metisMenu', ['$rootScope', '$timeout', 'config',
        function($rootScope, $timeout, config){
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    // Call the metsiMenu plugin and plug it to sidebar navigation
                    element.metisMenu();
                }
            }
        }
    ])
    
    /**
     * icheck - Directive for custom checkbox icheck
     */
    .directive('icheck', ['$timeout', function icheck($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).iCheck('update');
                    });

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green'
                    })
                        // This plugin change the way of input work
                        // So we need to handle event to change value="" manually in order to work with two way binding
                        .on('ifChanged', function(event) {
                            if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                                $scope.$apply(function() {
                                    return ngModel.$setViewValue(event.target.checked);
                                });
                            }
                            if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                                return $scope.$apply(function() {
                                    return ngModel.$setViewValue(value);
                                });
                            }
                        });
                });
            }
        };
    }])

    /**
     * widget-iframe directive
     *
     * This new directive is about the widget iframe container
     */
    .directive('widgetIframe', ['$rootScope', '$log', '$window', '$timeout', 'config', function ($rootScope, $log, $window, $timeout, config) {

        return {
            restrict: 'AE', // attribute name
            scope: {
                widget: '=widget'
            },
            // Here we use a template. It means that everything inside will use the directive controller instead of parent
            templateUrl: config.routes.templates + '/widget-iframe.tmpl.html',
            
            // Link is run after compilation
            // Separation of concern (here is DOM code)
            link: function(scope, element, attrs) {

                // Get jquery iframe element
                var $widgetElt = element.children('.widget-iframe');
                var $widgetRawElt = $widgetElt[0];
                var widgetID = scope.widget.identityHTML; // .Attr('id') return angular '{{foo}}' because directive is loaded before some angular work (you got it):/

                // This code is run after all render queue
                // Here all {{foo}} are replaced by value
                $timeout(function () {

                });
                
                /**
                 * On load event
                 * @description When iframe is loaded, send an init signal directly
                 */
                $widgetElt.bind("load" , function(e){
                    
                });

                /**
                 * When user send a signal to widget
                 */
                scope.$on('widget-signal', function(ev, widget, signal, hash){
                    // event to specific widget
                    if( angular.equals(widget, scope.widget) /* widget && widget.identityHTML == scope.widget.identityHTML*/ ){
                        $widgetRawElt.contentWindow.window.location.hash =  encodeURIComponent(hash);
                    }
                    // event to everyone
                    else if(widget == null){
                        //$widgetElt[0].src = sUrl + '#' + encodeURIComponent(hash);
                        $widgetRawElt.contentWindow.window.location.hash = encodeURIComponent(hash);
                    }
                    else{
                        // not for me
                    }
                });
                
                scope.$on('widget-reload', function(ev, widget){
                    if(widget.id === scope.widget.id){
                        $widgetRawElt.contentWindow.window.location.hash = '';
                        $widgetRawElt.contentDocument.location.reload();
                    }
                });

                

            },
            // Controller is run after general controller but before link of this directive
            // It ran before compilation
            // http://jasonmore.net/angular-js-directives-difference-controller-link/
            // So we keep separation of concern (here is logic code)
            controller: function($scope, $element, widgetService, $modal){

                var widget = $scope.widget; // We get widget as its a scoped var from html

                // Display option menu for specific widget
                // The dialog use another controller
                // We pass our sub controller (as the sub controller is defined inside parent he can reach the same var)
                $scope.showOptions = function($event) {
                    var modalInstance = $modal.open({
                        templateUrl: config.routes.templates + '/widget-iframe-options.tmpl.html',
                        controller: dialogController,
                        size: 'sm',
                        resolve: {
                            widget: function(){
                                return widget;
                            }
                        }
                    })
                    .result.then(function (result) {
                        $scope.result = result;
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                // Controller for dialog box
                // We cannot use the same because the dialog is open in another controller with reduce scope
                // Instead of create new controller alonside others we define here a sub controller
                // We could have used the global var of the parent controller but we prefer doing a complete declaration (widgetService or widget was available from parent)
                var dialogController = function($scope, $modalInstance, widgetService, widget, modalService, notifService, config){
                    $scope.widget = widget;

                    // Relative to modal
                    $scope.ok = function(){
                        $modalInstance.close(true);
                    };
                    $scope.cancel = function(){
                        $modalInstance.dismiss('cancel');
                    };
                    
                    // Relative to widgets
                    $scope.refresh = function(){
                        widgetService.sendSignal( widget, 'refresh' );
                    };
                    $scope.stop = function(){
                        widgetService.sendSignal( widget, 'stop' );
                    };
                    $scope.start = function(){
                        widgetService.sendSignal( widget, 'start' );
                    };
                    
                    // Here we prepare different options the widget has configured
                    // A scope with specific options is created
                    // The html will loop over all these option and build a form that correspond
                    $scope.options = []; // This var is used by view to render all form
                    angular.forEach(widget.options, function(option){
                        var tmp = {
                            id: option.id,
                            label: option.name,
                            placeholder: option.placeholder,
                            type: option.type,
                            name: option.id,
                            value: option.value
                        };
                        // In case of select we need to do some more job
                        if(tmp.type === 'select'){
                            tmp.selectOptions = [];
                            // Loop over all select option to create the ng-options
                            angular.forEach(option.options, function(label , index){
                                var selectOption = { label:label, value:index };
                                tmp.selectOptions.push(selectOption);
                                if( label === option.value ){
                                    tmp.value = selectOption;
                                }
                            });
                        }
                        $scope.options.push(tmp);
                    });

                    // Form submit
                    $scope.updateOptionsFormSubmit = function(){
                        if($scope.updateOptionsForm.$valid){

                            // build options data
                            // Just an associative array of options
                            var options = {};
                            // Loop over all options bound with <form>
                            // Set the new value to the widget
                            angular.forEach($scope.options, function(option, index){
                                if(option.type === 'select'){
                                    widget.setOptionValue(option.id, option.value.label);
                                }
                                else{
                                    widget.setOptionValue(option.id, option.value);
                                }
                            });
                            widget.save(options)
                                .then(function(){
                                    // Update local widget
                                    notifService.success( config.messages.success.widget.updated );
                                    widget.rebuildIframeURL(); // this method cause an automatic refresh
                                    $scope.ok();
                                }).catch(function(err){
                                    modalService.simpleError(err.message);
                                });
                        }
                        else{
                            notifService.error( config.messages.errors.form.invalid );
                        }
                    }
                };
            }
        }

    }])

    /**
     *
     * http://srobbin.com/jquery-plugins/backstretch/
     */
    .directive('ngBackstretch', function(config, $state, $rootScope, $log) {

            if (typeof $.fn.backstretch !== 'function')
                throw new Error('ngBackstretch | Please make sure the jquery backstretch plugin is included before this directive is added.');

            return {
                restrict: 'AE', // element
                link: function(scope, element, attr) {

                    //scope.$watch(attr.state, function ( newState ) {
                    //
                    //});

                        //if (attr.ngBackstretch === '' || typeof attr.ngBackstretch === 'undefined')
                        //    throw new Error('ngBackstretch | You have not declared an image to be stretched.')

                        // backstretch take an array of url so we take settings
                        // and create an array with image and url
                        var urls = [];
                        angular.forEach(config.user.backgroundImages, function(image){
                            urls.push(image);
                        });
                        // Instead of doing that we could have pass url directly or also use ng-backstrench=[...] in the html
                        // Thi sline is still here to keep in mind possibilities
                        attr.ngBackstretch = urls;
                    
                        //if (element.context.toString().match(/HTMLBodyElement/gi)){
                        //    return $.backstretch( attr.ngBackstretch , {
                        //        duration: settings.user.backgroundImagesInterval,
                        //        fade: 750
                        //    });
                        //}

                        // Apply to body
                        //$.backstretch(attr.ngBackstretch , {
                        //    duration: settings.user.backgroundImagesInterval,
                        //    fade: 750
                        //});
                    var isCreated = false;

                    $rootScope.$on('backstretch-pause', function(event){
                        pause();
                    });

                    $rootScope.$on('backstretch-resume', function(event){
                        resume();
                    });
                    
                    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                        if(toState.name == 'board'){
                            if( isCreated ){
                                resume();
                            }
                            else{
                                element.backstretch(attr.ngBackstretch , {
                                    duration: config.user.backgroundImagesInterval,
                                    fade: 750
                                });
                                isCreated = true;
                            }
                        }
                        else{
                            pause();
                        }
                    });
                    
                    function pause(){
                        $log.debug('Backstretch directive => pause');
                        // If backstretch was resuming, prevent it to put in pause (again)
                        // With that if user throw multiple pause / resume, it will no resume multiple time and let a latence to user
                        cancelResume();
                        if( isCreated ){
                            element.backstretch('pause');
                        }
                    }

                    /**
                     * Resume after initial duration (otherwise its directly change the image ugly) 
                     */
                    var isResuming = false;
                    var resumingProcess;
                    function resume(){
                        if(!isResuming){
                            isResuming = true;
                            $log.debug('Backstretch directive => resume');
                            if( isCreated ){
                                resumingProcess = setTimeout(function(){
                                    element.backstretch('resume');
                                    isResuming = false;
                                }, config.user.backgroundImagesInterval);

                            }
                        }
                    }
                    function cancelResume(){
                        if(resumingProcess){
                            clearTimeout(resumingProcess);
                        }
                        isResuming = false;
                    }

                }
            }

        }

    );

