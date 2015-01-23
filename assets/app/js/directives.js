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
    .module('app.directives',[])

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
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green'
                    }).on('ifChanged', function(event) {
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
    .directive('widgetIframe', ['$rootScope', '$log', '$window', '$timeout', function ($rootScope, $log, $window, $timeout) {

        return {
            restrict: 'AE', // attribute name
            scope: {
                widget: '=widget'
            },
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
                    
                    // This version use the iframeURL wich is linked directly to ng-src
                    // It cause a reload of all widget, then it's not nice
                    //var iframeURL = new $window.URI( scope.widget.iframeURL );
                    //iframeURL.hash( JSON.stringify({signal:"init"}) ); // set hash
                    //$log.debug('Widget ' + scope.widget.identity + ' has been initalized with URL ' + iframeURL.toString());
                    //scope.widget.iframeURL = iframeURL.toString();

                    // This version use primary javascript but at least it does not refresh element
                    //document.getElementById(element[0].id).contentWindow.window.location.hash = JSON.stringify({signal:"init"});

                });

                /**
                 * When user send a signal to widget
                 */
                scope.$on('widget-signal', function(ev, widget, signal, hash){
                    //console.log(widgetID);
                    //var sUrl = document.getElementById( widgetID ).src.replace(/#.*/, '');
                    //console.log(sUrl);
                    //console.log( sUrl + hash );
                    
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
                
                scope.$on('widget-reload', function(ev){
                    $widgetRawElt.contentWindow.window.location.hash = '';
                    console.log($widgetRawElt.contentWindow.window.location.hash);
                    console.log($widgetRawElt.contentWindow.window.location.href);
                    console.log($widgetRawElt.contentDocument.location);
                    $widgetRawElt.contentDocument.location.reload();
                });

                

            },
            controller: ['$scope', '$http', '$log', 'widgetService', function($scope, $http, $log, widgetService){

                var widget = $scope.widget; // We get widget as its a scoped var from html

                //console.log($scope);

                // Display option menu for specific widget
                // The dialog use another controller
                // We pass our sub controller (as the sub controller is defined inside parent he can reach the same var)
                $scope.showOptions = function($event) {
                    //console.log(widgetID);
                    //$mdDialog.show({
                    //	targetEvent: $event,
                    //	//parent: angular.element("#" + widget.identityHTML + "-container"),
                    //	templateUrl: 'app/templates/widget_options.tmpl.html',
                    //	controller: dialogController,
                    //	locals: { widget: widget }
                    //});
                };

                // Controller for dialog box
                // We cannot use the same because the dialog is open in another controller with reduce scope
                // Instead of create new controller alonside others we define here a sub controller
                // We could have used the global var of the parent controller but we prefer doing a complete declaration (widgetService or widget was available from parent)
                var dialogController = [ '$scope', '$mdDialog', 'widgetService', 'widget', function($scope, $mdDialog, widgetService, widget){
                    $scope.widget = widget;

                    $scope.refresh = function(){
                        widgetService.sendSignal( widget, 'refresh' );
                    };
                    $scope.stop = function(){
                        widgetService.sendSignal( widget, 'stop' );
                    };
                    $scope.start = function(){
                        widgetService.sendSignal( widget, 'start' );
                    };

                    $scope.closeDialog = function() {
                        // Easily hides most recent dialog shown...
                        // no specific instance reference is needed.
                        //$mdDialog.hide();
                    };
                }];
            }]
        }

    }])

    
    /**
     *
     * http://srobbin.com/jquery-plugins/backstretch/
     */
    .directive('ngBackstretch', ['config', '$state', '$rootScope', function(config, $state, $rootScope) {

            if (typeof $.fn.backstretch !== 'function')
                throw new Error('ngBackstretch | Please make sure the jquery backstretch plugin is included before this directive is added.');

            return {
                restrict: 'AE', // element
                //controller: function($scope){
                //
                //
                //},
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

                    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                        if(toState.name == 'board'){
                            if( isCreated ){
                                element.backstretch('resume');
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
                            if( isCreated ){
                                element.backstretch('pause');
                            }
                        }
                    });


                }
            }

        }

    ]);

