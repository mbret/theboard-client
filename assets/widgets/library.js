// #{"signal":"init","settings":{}}


(function(){

    // Define if the user provide a widget conf for testing (instead of URL)
    var isTestWidgetProvided = false;

    var testWidgetProvided = null;

    var logLvl = 'warn'; // warn / debug / info

    var serverURL = 'http://localhost:1337';

    function WidgetError() {
        var tmp = Error.apply(this, arguments);
        tmp.name = this.name = 'WidgetError'

        this.message = tmp.message
        /*this.stack = */Object.defineProperty(this, 'stack', { // getter for more optimizy goodness
            get: function() {
                return tmp.stack
            }
        });

        return this
    }
    var IntermediateInheritor = function() {}
    IntermediateInheritor.prototype = Error.prototype;
    WidgetError.prototype = new IntermediateInheritor();

    /**
     * This is util for library and widget
     */
    var Utils = {

        serverURL: serverURL,

        messages:{
            error: {

            }
        },

        handleError: function( err ){
            document.body.innerHTML = '<div class="widget-error">Widget on error!</div>';
            console.error( err );
        },

        /**
         * Be careful to not refresh page when removing hash
         */
        resetSignal: function(){
            window.location.hash = '#';
        },

        /**
         * 
         * - take care of eventual hash and ignore it
         * @returns {Array}
         */
        getUrlVars: function(){
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

            // remove eventual hash
            var indexOfLastHash = hashes[hashes.length -1].lastIndexOf('#');
            indexOfLastHash = (indexOfLastHash > -1) ? indexOfLastHash : hashes[hashes.length -1].length; // -1 means the were no hash
            hashes[hashes.length -1] = hashes[hashes.length -1].substring(0, indexOfLastHash); // take all string or only good part
            
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('='); // get var name and its value into array
                // only continue if a var has a value
                if( hash.length > 1 ){
                    vars.push(hash[0]);
                    // URI.js use encodeURIComponent
                    // I don't know why but (+) are not decoded in ' ' as it should ?
                    vars[hash[0]] = decodeURIComponent(hash[1].replace('+', ' '));
                }
            }
            // remove hash for last if there is
            var hashToRemove = window.location.hash;
            if(hashToRemove){
                for( var i = 0 ; i<vars.length ; i++){
                    vars[vars[i]] = vars[vars[i]].replace( window.location.hash, '');
                }
            }
            return vars;
        },

        checkValidityOfJsonFromUrl: function(jsonToParse){
            try{
                return JSON.parse(jsonToParse);
            }
            catch(e){
                return false;
            }
        },

        log: {
            debug: function(message, obj){
                if(logLvl == 'debug' || logLvl == 'all'){
                    if(obj) console.debug('Widget ' + window.location.pathname + ' -> ' + message, obj);
                    else console.debug('Widget ' + window.location.pathname + ' -> ' + message);
                }
            },
            warn: function(message, obj){
                if(logLvl == 'warn' || logLvl == 'debug' || logLvl == 'all'){
                    if(obj) console.warn('Widget ' + window.location.pathname + ' -> ' + message, obj);
                    else console.warn('Widget ' + window.location.pathname + ' -> ' + message);
                }
            }
        },

        convertUnixTsToDate: function( unixTS ){
            // create a new javascript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds
            var date = new Date(unixTS*1000);
            return date;
        }

    };

    //var widget = {
    //    identity: 'Widget Sample',
    //    settings: {
    //        userMail: 'user@user.com',
    //        location: 'France'
    //    }
    //};
    //var other = {test:'foo'};
    //console.log('?widget='+JSON.stringify(widget) + '&other=' + JSON.stringify(other));


    //function readSignal(){
    //    var hash = window.location.hash.substring(1);
    //    var obj = JSON.parse(hash);
    //    console.log(obj);
    //    return obj.signal;
    //}

    var WidgetAdapter = {
        signal: null,
        configuration: null // will be fill from url

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

                //console.log('New hash received ', window.location.hash);

                // Received hash is an stringified object
                // #(obj)
                var hash = window.location.hash.substring(1);
                var hashObject = JSON.parse( decodeURIComponent(hash));

                // Fire event refresh when signal received
                if( hashObject.signal === vthis.signals.refresh  ){
                    Utils.resetSignal();

                    WidgetAdapter.signal = hashObject.signal;
                    try{
                        Widget.refresh();
                    }
                    catch(err){
                        Utils.handleError( new Error('Please add a method (refresh) to your widget!') );
                    }
                }

                // Fire event refresh when signal received
                if( hashObject.signal === vthis.signals.stop  ){
                    Utils.resetSignal();
                    WidgetAdapter.signal = hashObject.signal;
                    try{
                        Widget.stop();
                    }
                    catch(err){
                        Utils.handleError( new Error('Please add a method (refresh) to your widget!') );
                    }
                }

                if( hashObject.signal === vthis.signals.start  ){
                    Utils.resetSignal();
                    WidgetAdapter.signal = hashObject.signal;
                    try{
                        Widget.start();
                    }
                    catch(err){
                        Utils.handleError( new Error('Please add a method (refresh) to your widget!') );
                    }
                }
            }, false);
            return;
        }

    };
    w.init();


    // ===============
    // Some init
    // widgetConfiguration is an object that can be create by widget creator to 
    // overwrite some settings
    // ===============
    if( typeof widgetConfiguration !== 'undefined' ){
        Utils.log.debug('Substitute configuration provided by user. Use it instead of default library configuration!');
        if( widgetConfiguration.widget && widgetConfiguration.widget.configuration){
            isTestWidgetProvided = true;
            testWidgetProvided = widgetConfiguration.widget;
        }
        if( widgetConfiguration.log ){
            logLvl = widgetConfiguration.log;
        }
    }
    else{
        Utils.log.debug('No substitute configuration provided by user. Use default library configuration!');
    }


    try{
        // ===============
        // STEP 1
        // ===============
        // Get eventual settings from application
        // The first run a settings object may be passed by application
        var tmp = Utils.getUrlVars();
        
        // Get and build widget configuration into adapter
        if( testWidgetProvided ){
            WidgetAdapter.configuration = testWidgetProvided.configuration;
        }
        else{
            if( !tmp.widget){
                throw new WidgetError("No widget configuration specified into URL");
            }
            if( ! Utils.checkValidityOfJsonFromUrl( tmp.widget )){
                throw new WidgetError("Please specify a valid widget configuration");
            }
            WidgetAdapter.configuration = JSON.parse(tmp.widget);
        }
        Utils.log.debug('Widget configuration has been loaded ', WidgetAdapter.configuration);

        // ===============
        // STEP 2
        // ===============
        // Intercept first window load
        // Send the first signal event
        if(window.location.hash) {
            window.dispatchEvent(
                new Event('hash-received')
            );
        }
        // Set the handler listener for future hash change
        window.onhashchange = function(){
            // Check hash
            if(window.location.hash == null || window.location.hash == ''){
                return;
            }
            window.dispatchEvent(
                new Event('hash-received')
            );
        };

        // ===============
        // STEP 3
        // ===============
        // Export module
        //window.WidgetAdapter = WidgetAdapter;
        window.WidgetUtils = Utils;

        // ===============
        // STEP 4
        // ===============
        // Run The widget
        Widget.identity = WidgetAdapter.configuration.identity;
        //Widget.configuration = WidgetAdapter.configuration;
        Utils.log.debug('Widget has been prepared by library and is calling with init() method');
        
        try{
            Widget.init( WidgetAdapter.configuration );
        }
        catch(e){
            Utils.log.warn('Widget (' + WidgetAdapter.configuration.identity + ') is on error', e);
            throw e;
        }
    }
    catch(e){
        if(e instanceof WidgetError){
            console.error('A problem occurred when initialising library!', e.message);
        }else{
            // If you came here because of an thrown exception then you need to try with another nav. Chrome is bugged and doesn't keep stack.
            throw e;
        }

    }


}).call(this);