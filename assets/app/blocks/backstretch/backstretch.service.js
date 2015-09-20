(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('blocks.backstretch')
        .factory('backstretch', backstretch);

    backstretch.$inject = ['$http', 'APP_CONFIG', 'logger'];

    function backstretch($http, APP_CONFIG, logger) {

        return new function() {

            var self    = this;

            // Connected to directive API
            this.status = null;
            this.delay  = null;

            this.pause = function(){
                self.status = 'pause';
            };

            this.resume =  function( newDelay ) {
                self.status = 'resume';
                self.delay = newDelay;
            };

            this.toggle =  function(){
                if(status === 'resume'){
                    self.status = 'pause';
                }
                else{
                    self.status = 'resume';
                }
            };

            this.destroy =  function(){
                self.status = 'destroy';
            };

        }
    }

})();