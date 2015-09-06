(function() {
    'use strict';
    
    angular.module('app.directives')
        .directive('knob', function ($timeout) {
            return {
                restrict: 'EACM',
                template: function(elem, attrs){
                    return '<input  value="{{ knobData }}">';
                },
                replace: true,
                scope: {
                    knobData: '=',
                    knobOptions: '&'
                },
                link: function (scope, elem, attrs) {

                    scope.knob = scope.$eval(scope.knobData);
                    

                    
                    var renderKnob = function(){

                        scope.knob = scope.$eval(scope.knobData);

                        var opts = {};
                        if(!angular.isUndefined(scope.knobOptions)){
                            var object = scope.$eval(scope.knobOptions);
                            if(typeof object){
                                opts = scope.$eval(scope.knobOptions);
                            }
                        }

                        opts.release = function release(newValue){
                            $timeout(function() {
                                scope.knobData = newValue;
                                scope.$apply();
                            });
                        };
                        
                        var $elem = $(elem);
                        $elem.val(scope.knobData);
                        $elem.change();
                        $elem.knob(opts);

                    };

                    scope.$watch(scope.knobData, function () {
                        renderKnob();
                    });

                    scope.$watch(scope.knobOptions, function () {
                        renderKnob();
                    }, true);

                }
            };
        });
})();
