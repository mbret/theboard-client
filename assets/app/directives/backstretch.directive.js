(function() {
    'use strict';

    /**
     *
     * http://srobbin.com/jquery-plugins/backstretch/
     */
    angular
        .module('app.directives')
        .directive('backstretch', backstretch);

    backstretch.$inject = ['$rootScope', 'config', 'backstretch', 'logger', '_', '$timeout'];

    /**
     * The directive must have ="value" with value as an array
     */
    function backstretch ($rootScope, config, backstretch, logger, _, $timeout) {
        
        if (typeof $.fn.backstretch !== 'function')
            throw new Error('ngBackstretch | Please make sure the jquery backstretch plugin is included before this directive is added.');

        return {
            restrict: 'AE', // element
            link: function(scope, element, attrs) {

                var isResuming = false;
                var resumingProcess;
                var images;
                var instance;
                
                // Attach API to watch status
                scope.api = backstretch;
                
                // Watch for API call (controller, etc)
                scope.$watch('api.status', watchStatus);
                
                // Watch for new images inserted in directive
                scope.$watch(attrs.backstretch, imagesChanges);

                function imagesChanges(value) {
                    if( value instanceof Array){
                        images = value;
                    }
                    else{
                        images = [];
                    }
                    //resume();
                }

                function init(){
                    logger.debug('backstretch create');
                    element.backstretch(images , {
                        duration: config.user.backgroundImagesInterval,
                        fade: 750
                    });
                    instance = element.data('backstretch');
                }

                function pause(){
                    logger.debug('Backstretch pause');
                    // If backstretch was resuming, prevent it to put in pause (again)
                    // With that if user throw multiple pause / resume, it will no resume multiple time and let a latence to user
                    cancelResume();
                    if( instance !== null && instance !== undefined ){
                        element.backstretch('pause');
                    }
                }

                /**
                 * Resume after initial duration (otherwise its directly change the image ugly)
                 */
                function resume(){
                    var delay = backstretch.delay;
                    backstretch.delay = null;
                    
                    if(!isResuming){
                        isResuming = true;
                        logger.debug('backstretch resume');
                        if( instance === null || instance === undefined ){
                            $timeout(init, delay);
                        }
                        else{
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
                
                function destroy(){
                    logger.debug('backstretch destroy');
                    cancelResume();
                    if( instance !== null && instance !== undefined ){
                        element.backstretch("destroy", false /*preserveBackground*/);
                        instance = null;
                    }
                };
                
                function watchStatus(){
                    if(scope.api.status === 'pause'){
                        pause();
                    }
                    if(scope.api.status === 'resume'){
                        resume();
                    }
                    if(scope.api.status === 'destroy'){
                        destroy();
                    }
                }
                

            }
        }
    }
})();
