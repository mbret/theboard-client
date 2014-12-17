'use strict';

var directives = angular.module('theboardDirectives',[]);

directives.directive('pluginIframe', function () {

    return {
        link: function(scope, element, attrs) {

            element.bind("load" , function(e){

                // success, "onload" catched
                // now we can do specific stuff:
                var widget = document.getElementById(this.id).contentWindow.widget;
                scope.app.widgets[widget.identity] = widget;
                console.log('Widget [' + widget.identity + '] loaded!');
                widget.commonLib = scope.app.commonLib;
                widget.init();
            });
        }
    }

});