(function() {
    'use strict';

    /**
     *
     * http://srobbin.com/jquery-plugins/backstretch/
     */
    angular
        .module('blocks.pageTitle')
        .directive('pageTitle', pageTitle);

    pageTitle.$inject = ['$rootScope', '$timeout', 'config'];

    /**
     * Use declarative approach
     * Use it with <title page-title></title>
     */
    function pageTitle ($rootScope, $timeout, config) {
        return {
            restrict: 'A',
            scope: {
                prefix: '=prefix',
                suffix: '=suffix'
            },
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
})();
