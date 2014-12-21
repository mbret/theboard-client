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
    .directive('widgetIframe', ['$rootScope', '$log', function ($rootScope, $log) {

        return {
            link: function(scope, element, attrs) {

                /**
                 * On load event
                 * @description When iframe is loaded, send an init signal directly
                 */
                element.bind("load" , function(e){

                    // success, "onload" catched
                    // now we can do specific stuff:
                    //var widget = document.getElementById(this.id).contentWindow.widget;
                    //scope.app.widgets[widget.identity] = widget;
                    //console.log('Widget [' + widget.identity + '] loaded!');
                    //widget.commonLib = scope.app.commonLib;
                    //widget.init();

                    document.getElementById(this.id).contentWindow.window.location.hash = 'init';
                    //scope.widgets[ this.id ] = document.getElementById(this.id);

                    //scope.showSimpleToast( 'Widget loaded' );
                    //console.log(document.getElementById(this.id).contentWindow);
                });

                /**
                 * When user send
                 */
                scope.$on('widget-signal', function(ev, widget, signal){
                    var iframeWidgetElement = element[0];

                    // event to specific widget
                    if(widget && widget.identityHTML == iframeWidgetElement.id){
                        document.getElementById(iframeWidgetElement.id).contentWindow.window.location.hash = signal ;
                    }
                    // event to everyone
                    else if(widget == null){
                        document.getElementById(iframeWidgetElement.id).contentWindow.window.location.hash = signal ;
                    }
                    else{
                        // not for me
                    }
                });


            }
        }

    }]);

    //.directive('resizeWidgetContent', function () {
    //
    //    return {
    //        link: function(scope, element, attrs) {
    //
    //            element.bind("load" , function(e){
    //
    //                // success, "onload" catched
    //                // now we can do specific stuff:
    //                //var widget = document.getElementById(this.id).contentWindow.widget;
    //                //scope.app.widgets[widget.identity] = widget;
    //                //console.log('Widget [' + widget.identity + '] loaded!');
    //                //widget.commonLib = scope.app.commonLib;
    //                //widget.init();
    //
    //                //document.getElementById(this.id).contentWindow.window.location.hash = 'init';
    //                //scope.app.widgets[ this.id ] = document.getElementById(this.id);
    //
    //                //scope.showSimpleToast( 'Widget loaded' );
    //                //console.log(document.getElementById(this.id).contentWindow);
    //            });
    //        }
    //    }
    //
    //});
