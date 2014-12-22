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

    }]);

