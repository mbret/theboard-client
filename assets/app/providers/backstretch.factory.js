(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app')
        .factory('backstretch', backstretch);

    backstretch.$inject = ['$http', 'APP_CONFIG', 'logger'];

    function backstretch($http, APP_CONFIG, logger) {
        return {
            status: null,
            delay: null,
            pause: function() {
                this.status = 'pause';
            },
            resume: function( delay ) {
                this.status = 'resume';
                this.delay = delay;
            },
            toggle: function(){
                if(this.status === 'resume'){
                    this.status = 'pause';
                }
                else{
                    this.status = 'resume';
                }
            },
            destroy: function(){
                this.status = 'destroy';
            }
        }
    }

})();