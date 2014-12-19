'use strict';

var directives = angular.module('theboardDirectives',[]);

directives.directive('widgetIframe', function () {

    return {
        link: function(scope, element, attrs) {

            element.bind("load" , function(e){

                // success, "onload" catched
                // now we can do specific stuff:
                //var widget = document.getElementById(this.id).contentWindow.widget;
                //scope.app.widgets[widget.identity] = widget;
                //console.log('Widget [' + widget.identity + '] loaded!');
                //widget.commonLib = scope.app.commonLib;
                //widget.init();

                document.getElementById(this.id).contentWindow.window.location.hash = 'init';
                scope.app.widgets[ this.id ] = document.getElementById(this.id);

                //scope.showSimpleToast( 'Widget loaded' );
                //console.log(document.getElementById(this.id).contentWindow);
            });
        }
    }

});