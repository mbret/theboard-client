(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app')
        .factory('backstretch', backstretch);

    backstretch.$inject = ['$http', 'config', 'logger'];

    function backstretch($http, config, logger) {
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
                console.log('toggle', this.status);
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