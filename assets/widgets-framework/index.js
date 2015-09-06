(function(){

    'use strict';

    var self = this;
    var VERSION = '0.0.1';
    var SERVER_URL = 'http://localhost:1337';
    var SIGNALS = {
        INIT: 'init',
        REFRESH: 'refresh',
        STOP: 'stop',
        START: 'start'
    };
    var configHelper = window.configHelper;
    var utils = window.theboardUtils;

    var Module = function(){

        var self = this;

        // Handle hash change
        // Needed to fire widget important events
        document.addEventListener('widget.hash.received', onHashReceived, false);

        this.start = function(widgetConfig){
            _init(widgetConfig);
        };

        function _init(widgetConfig){

            // Intercept first window load
            // Send the first signal event
            if(window.location.hash){
                document.dispatchEvent(
                    new Event('widget.hash.received')
                );
            }

            // Set the handler listener for future hash change
            window.onhashchange = function(){
                // Check hash
                if(window.location.hash == null || window.location.hash == ''){
                    return;
                }
                document.dispatchEvent(
                    new Event('widget.hash.received')
                );
            };

            // Prepare configuration for the widget
            // the config is loaded from url and created as an object
            var configuration = configHelper.loadWidgetConfiguration(widgetConfig);

            console.debug('module trigger widget.ready with', configuration);
            document.dispatchEvent(
                new CustomEvent('widget.ready', {detail: configuration })
            );
        };

        function onHashReceived(e){
            // Received hash is an stringified object
            // #(obj)
            var hash = window.location.hash.substring(1);
            var hashObject = JSON.parse( decodeURIComponent(hash));

            // When refresh signal is received
            // Send refresh event to widget
            if( hashObject.signal === SIGNALS.REFRESH  ){
                utils.resetSignal();
                document.dispatchEvent(
                    new Event('widget.refresh')
                );
            }

            // Fire event refresh when signal received
            if( hashObject.signal === SIGNALS.STOP  ){
                utils.resetSignal();
                document.dispatchEvent(
                    new Event('widget.stop')
                );
            }

            if( hashObject.signal === SIGNALS.START  ){
                utils.resetSignal();
                document.dispatchEvent(
                    new Event('widget.start')
                );
            }
        }
    };

    // Export
    window.theBoardModule = new Module();

}).call(this);