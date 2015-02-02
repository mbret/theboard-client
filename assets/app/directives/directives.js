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
    .module('app.directives')

    /**
     * Control the sidebar component
     * For now it only reset the state when route change. In that way the sidebar is always reset when user leave the /board state
     */
    .directive('sidebar', ['$rootScope', '$timeout', 'config', 'sidebarService',
        function($rootScope, $timeout, config, sidebarService){
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    
                    // get eventual attribute 
                    // sidebar-close="" define who whant a sidebar closed at state change
                    var stateWhoWhantSidebarClosed = attrs.sidebarClose;
                    
                    // Reset sidebar when the route is changed
                    //
                    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                        if(toState.name == stateWhoWhantSidebarClosed){
                            sidebarService.close();
                        }
                        else{
                            sidebarService.putStatic(); // put static (disable backdrop)
                        }
                    });
                }
            }
        }
    ])

    /**
     * Apply the plugin metis menu to the element that have the directive
     * (in our app it come to the sidebar ul)
     */
    .directive('metisMenu', ['$rootScope', '$timeout', 'config',
        function($rootScope, $timeout, config){
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    // Call the metsiMenu plugin and plug it to sidebar navigation
                    $timeout(function(){
                        element.metisMenu();
                    });
                }
            }
        }
    ])
    
    /**
     * icheck - Directive for custom checkbox icheck
     */
    .directive('icheck', ['$timeout', function icheck($timeout) {
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
    }])

    /**
     *
     * http://srobbin.com/jquery-plugins/backstretch/
     */
    .directive('ngBackstretch', function(config, $state, $rootScope, $log) {

            if (typeof $.fn.backstretch !== 'function')
                throw new Error('ngBackstretch | Please make sure the jquery backstretch plugin is included before this directive is added.');

            return {
                restrict: 'AE', // element
                link: function(scope, element, attr) {

                    //scope.$watch(attr.state, function ( newState ) {
                    //
                    //});

                        //if (attr.ngBackstretch === '' || typeof attr.ngBackstretch === 'undefined')
                        //    throw new Error('ngBackstretch | You have not declared an image to be stretched.')

                        // backstretch take an array of url so we take settings
                        // and create an array with image and url
                        var urls = [];
                        angular.forEach(config.user.backgroundImages, function(image){
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
                        //$.backstretch(attr.ngBackstretch , {
                        //    duration: settings.user.backgroundImagesInterval,
                        //    fade: 750
                        //});
                    var isCreated = false;

                    $rootScope.$on('backstretch-pause', function(event){
                        pause();
                    });

                    $rootScope.$on('backstretch-resume', function(event){
                        resume();
                    });
                    
                    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                        if(toState.name == 'board'){
                            if( isCreated ){
                                resume();
                            }
                            else{
                                element.backstretch(attr.ngBackstretch , {
                                    duration: config.user.backgroundImagesInterval,
                                    fade: 750
                                });
                                isCreated = true;
                            }
                        }
                        else{
                            pause();
                        }
                    });
                    
                    function pause(){
                        $log.debug('Backstretch directive => pause');
                        // If backstretch was resuming, prevent it to put in pause (again)
                        // With that if user throw multiple pause / resume, it will no resume multiple time and let a latence to user
                        cancelResume();
                        if( isCreated ){
                            element.backstretch('pause');
                        }
                    }

                    /**
                     * Resume after initial duration (otherwise its directly change the image ugly) 
                     */
                    var isResuming = false;
                    var resumingProcess;
                    function resume(){
                        if(!isResuming){
                            isResuming = true;
                            $log.debug('Backstretch directive => resume');
                            if( isCreated ){
                                resumingProcess = setTimeout(function(){
                                    element.backstretch('resume');
                                    isResuming = false;
                                }, config.user.backgroundImagesInterval);

                            }
                        }
                    }
                    function cancelResume(){
                        if(resumingProcess){
                            clearTimeout(resumingProcess);
                        }
                        isResuming = false;
                    }

                }
            }

        }

    );

