(function() {
    'use strict';

    /**
     *
     * http://srobbin.com/jquery-plugins/backstretch/
     */
    angular
        .module('blocks.pageTitle')
        .directive('pageTitle', pageTitle);

    pageTitle.$inject = ['$rootScope', '$timeout', 'APP_CONFIG'];

    /**
     * Use declarative approach
     * Use it with <title page-title></title>
     */
    function pageTitle ($rootScope, $timeout, APP_CONFIG) {
        return {
            restrict: 'A',
            scope: {
                prefix: '=prefix',
                suffix: '=suffix'
            },
            link: function(scope, element, attr) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title - load on Dashboard 1
                    var title = APP_CONFIG.pageTitle + ' | Home';
                    // Create your own title pattern
                    if (toState.pageTitle && toState.pageTitle) title = APP_CONFIG.pageTitle + ' | ' + toState.pageTitle;
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
