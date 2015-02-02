/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app')
        .constant('toastr', toastr)
        .constant('_', _)
        //.constant('test', 'TEST')
        //.config(function($provide){
        //    $provide.constant('config', window.appConfig);
        //})
})();
