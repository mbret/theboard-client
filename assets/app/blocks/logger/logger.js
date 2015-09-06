(function() {
    'use strict';

    /**
     * To eventually use notif like toaster and still make this block independant we could use something like
     * loggerProvider.addAction('success', function(){ toastr.success... });
     */
    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log'];

    /**
     *
     * @param $log
     * @param notifService
     * @returns {{showToasts: boolean, error: error, info: info, success: success, warning: warning, log: ($log.log|*)}}
     */
    function logger($log) {
        var service = {
            //showToasts: true,

            error   : error,
            info    : info,
            debug   : debug,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;

        function error(message, data, title) {
            //if(this.showToasts) notifService.error(message, title);
            //$log.error('Error: ' + message, data);
            //console.log(message);
            $log.error('Error trace: ', message.stack);
        }

        function debug(message, data, title) {
            //if(this.showToasts) notifService.info(message, title);
            $log.debug('Debug: ' + message, data);
        }
        
        function info(message, data, title) {
            //if(this.showToasts) notifService.info(message, title);
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            //if(this.showToasts) notifService.success(message, title);
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            //if(this.showToasts) notifService.warning(message, title);
            $log.warn('Warning: ' + message, data);
        }
    }
}());
