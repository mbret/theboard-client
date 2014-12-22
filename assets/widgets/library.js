// #{"signal":"init","settings":{}}

(function(){



    //var widget = {
    //    identity: 'Widget Sample',
    //    settings: {
    //        userMail: 'user@user.com',
    //        location: 'France'
    //    }
    //};
    //var other = {test:'foo'};
    //console.log('?widget='+JSON.stringify(widget) + '&other=' + JSON.stringify(other));

    /**
     * Be careful to not refresh page when removing hash
     */
    function resetSignal(){
        window.location.hash = '#';
    }

    function initControlForStandalone(){

    }

    //function readSignal(){
    //    var hash = window.location.hash.substring(1);
    //    var obj = JSON.parse(hash);
    //    console.log(obj);
    //    return obj.signal;
    //}

    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            // URI.js use encodeURIComponent
            // I don't know why but (+) are not decoded in ' ' as it should ?
            vars[hash[0]] = decodeURIComponent(hash[1].replace('+', ' '));
        }
        // remove hash for last if there is
        var hashToRemove = window.location.hash;
        if(hashToRemove){
            for( var i = 0 ; i<vars.length ; i++){
                vars[vars[i]] = vars[vars[i]].replace( window.location.hash, '');
            }
        }
        return vars;
    }

    var WidgetAdapter = {
        signal: null,
        widget: null // will be fill from url

        // maybe some futures useful method here
        // ...
    };

    var w = {

        signals: {
            init: 'init',
            refresh: 'refresh',
            stop: 'stop',
            start: 'start'
        },

        init: function(){

            var vthis = this;

            // Handle hash change
            // Needed to fire widget important events
            window.addEventListener('hash-received', function (e) {

                console.log('New hash received ', window.location.hash);

                // Received hash is an stringified object
                var hash = window.location.hash.substring(1);
                var hashObject = JSON.parse(hash);

                // Fire event refresh when signal received
                if( hashObject.signal === vthis.signals.refresh  ){
                    resetSignal();
                    WidgetAdapter.signal = hashObject.signal;
                    window.dispatchEvent(
                        new Event('widget-refresh')
                    );
                }

                // Fire event refresh when signal received
                if( hashObject.signal === vthis.signals.stop  ){
                    resetSignal();
                    WidgetAdapter.signal = hashObject.signal;
                    window.dispatchEvent(
                        new Event('widget-stop')
                    );
                }

                if( hashObject.signal === vthis.signals.start  ){
                    resetSignal();
                    WidgetAdapter.signal = hashObject.signal;
                    window.dispatchEvent(
                        new Event('widget-start')
                    );
                }
            }, false);
            return;
        }

    };
    w.init();

    // Get eventual settings from application
    // The first run a settings object may be passed by application
    var tmp = getUrlVars();
    try{
        WidgetAdapter.widget = JSON.parse(tmp.widget);
    }
    catch(e){
        console.error(new Error('A problem occurred when trying to extract widget information from URL! Please verify that widget is present and well formed'));
    }

    // Intercept first window load
    // Send the first signal event
    if(window.location.hash) {
        window.dispatchEvent(
            new Event('hash-received')
        );
    }
    // Set the handler listener for future hash change
    window.onhashchange = function() {
        // Check hash
        if(window.location.hash == null || window.location.hash == ''){
            return;
        }
        window.dispatchEvent(
            new Event('hash-received')
        );
    };

    console.log(WidgetAdapter);

    // Export module
    window.WidgetAdapter = WidgetAdapter;

    // Run The widget
    try{
        Widget.init( WidgetAdapter.widget );
    }
    catch(e){
        document.body.innerHTML = '<div class="widget-error">Widget on error!</div>';
        console.error(new Error('Unable to call .init() method of the widget ('+ WidgetAdapter.widget.identity + '). Be sure the library is loaded after your widget and your widget contain .init() method'));
    }

}).call(this);