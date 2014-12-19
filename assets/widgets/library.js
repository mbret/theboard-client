(function(){

    function resetSignal(){
        window.location.hash = null;
    }

    function readSignal(){
        var hash = window.location.hash.substring(1);
        return hash;
    }


    var theBoardWidget = {

        signals: {
            init: 'init',
            refresh: 'refresh',
            stop: 'stop',
            start: 'start'
        },

        widgetURL : 'localhost:1337/widgets',

        init: function(){

            var vthis = this;

            // Handle hash change
            // Needed to fire widget importent events
            window.onhashchange = function() {

                // Fire event init when init signal is received
                if( readSignal() === vthis.signals.init ){
                    resetSignal();
                    window.dispatchEvent(
                        new Event('widget-init')
                    );
                }

                // Fire event refresh when signal received
                if( readSignal() === vthis.signals.refresh  ){
                    resetSignal();
                    window.dispatchEvent(
                        new Event('widget-refresh')
                    );
                }

                // Fire event refresh when signal received
                if( readSignal() === vthis.signals.stop  ){
                    resetSignal();
                    window.dispatchEvent(
                        new Event('widget-stop')
                    );
                }

                if( readSignal() === vthis.signals.start  ){
                    resetSignal();
                    window.dispatchEvent(
                        new Event('widget-start')
                    );
                }
            }
            return;
        },

        library: {

        }

    }.init();


    // Export module
    window.theboardWidget = theBoardWidget;

}).call(this);