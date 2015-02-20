(function() {
    'use strict';

    /**
     *
     */
    angular
        .module('app.directives')
        .directive('ngConfirmClick', ngConfirmClick);

    ngConfirmClick.$inject = [];

    /**
     * A generic confirmation for risky actions.
     * Usage: Add attributes: ng-confirm-message="Are you sure"? ng-confirm="takeAction()" function
     */
    function ngConfirmClick () {

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    var message = attrs.ngConfirmClick;
                    if (message && !confirm(message)) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            }
        };
    }
})();
