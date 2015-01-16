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
    .directive('pageTitle', ['$rootScope', '$timeout', 'settings',
        function($rootScope, $timeout, settings){
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    var listener = function(event, toState, toParams, fromState, fromParams) {
                        // Default title - load on Dashboard 1
                        var title = settings.app.pageTitle + ' | Home';
                        // Create your own title pattern
                        if (toState.data && toState.data.pageTitle) title = settings.app.pageTitle + ' | ' + toState.data.pageTitle;
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

    .directive('sidebar', ['$rootScope', '$timeout', 'settings',
        function($rootScope, $timeout, settings){
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
     * widget-iframe directive
     *
     * This new directive is about the widget iframe container
     */
    .directive('widgetIframe', ['$rootScope', '$log', '$window', function ($rootScope, $log, $window) {

        return {
            restrict: 'A', // attribute name
            scope: {
                widget: '=widget'
            },
            link: function(scope, element, attrs) {

                /**
                 * On load event
                 * @description When iframe is loaded, send an init signal directly
                 */
                element.bind("load" , function(e){

                    // This version use the iframeURL wich is linked directly to ng-src
                    // It cause a reload of all widget, then it's not nice
                    //var iframeURL = new $window.URI( scope.widget.iframeURL );
                    //iframeURL.hash( JSON.stringify({signal:"init"}) ); // set hash
                    //$log.debug('Widget ' + scope.widget.identity + ' has been initalized with URL ' + iframeURL.toString());
                    //scope.widget.iframeURL = iframeURL.toString();

                    // This version use primary javascript but at least it does not refresh element
                    document.getElementById(element[0].id).contentWindow.window.location.hash = JSON.stringify({signal:"init"});

                });

                /**
                 * When user send
                 */
                scope.$on('widget-signal', function(ev, widget, signal){
                    var iframeWidgetElement = element[0];

                    // event to specific widget
                    if( angular.equals(widget, scope.widget) /* widget && widget.identityHTML == scope.widget.identityHTML*/ ){
                        document.getElementById(iframeWidgetElement.id).contentWindow.window.location.hash =  JSON.stringify({signal:signal});
                    }
                    // event to everyone
                    else if(widget == null){
                        document.getElementById(iframeWidgetElement.id).contentWindow.window.location.hash = JSON.stringify({signal:signal});
                    }
                    else{
                        // not for me
                    }
                });


            }
        }

    }])

    /**
     *
     * http://srobbin.com/jquery-plugins/backstretch/
     */
    .directive('ngBackstretch', ['settings', function(settings) {

            if (typeof $.fn.backstretch !== 'function')
                throw new Error('ngBackstretch | Please make sure the jquery backstretch plugin is included before this directive is added.');

            return {
                restrict: 'E', // element
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
                        angular.forEach(settings.user.backgroundImages, function(image){
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
                        $.backstretch(attr.ngBackstretch , {
                            duration: settings.user.backgroundImagesInterval,
                            fade: 750
                        });



                }
            }

        }

    ]);

