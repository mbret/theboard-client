(function() {
    'use strict';

    /**
     *
     */
    angular
        .module('app.directives')
        .directive('icheck', iCheck);

    iCheck.$inject = ['$timeout'];

    /**
     * icheck - Directive for custom checkbox icheck
     */
    function iCheck ($timeout) {
        
        if (typeof $.fn.iCheck !== 'function')
            throw new Error('iCheck | Please make sure the iCheck plugin is included before this directive is added.');

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
    }
})();
