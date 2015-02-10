(function(){

    'use strict';
    
    var that = this;
    var Widget = window.Widget;

    // Define if the user provide a widget conf for testing (instead of URL)
    var testWidgetProvided = null;

    var LOG_LVL = 'warn'; // warn / debug / info
    var VERSION = '0.0.1';
    var SERVER_URL = 'http://localhost:1337';
    var SIGNALS = {
        INIT: 'init',
        REFRESH: 'refresh',
        STOP: 'stop',
        START: 'start'
    };
    
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

        serverURL: SERVER_URL,

        messages:{
            error: {

            }
        },

        init: function(){
            // Export module
            //window.WidgetAdapter = WidgetAdapter;
            window.WidgetUtils = this;
            return this;
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
                if( LOG_LVL == 'debug' || LOG_LVL == 'all'){
                    if(obj) console.debug('Widget ' + window.location.pathname + ' -> ' + message, obj);
                    else console.debug('Widget ' + window.location.pathname + ' -> ' + message);
                }
            },
            warn: function(message, obj){
                if( LOG_LVL == 'warn' || LOG_LVL == 'debug' || LOG_LVL == 'all'){
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

    }.init();

    var WidgetAdapter = {
        signal: null,
        configuration: null // will be fill from url
    };

    var Module = new function(){

        var widget; // widget instance

        WidgetAdapter.configuration = _loadWidgetConfiguration();
        Utils.log.debug('Widget configuration has been loaded ', WidgetAdapter.configuration);
        
        // Intercept first window load
        // Send the first signal event
        if(window.location.hash) {
            window.dispatchEvent(
                new Event('hash-received')
            );
        }

        Utils.log.debug('Widget has been prepared by library and is calling with init() method');

        if( typeof Widget !== 'function' ){
            widget = Widget.init(WidgetAdapter.configuration);
        }
        else{
            widget = new Widget( WidgetAdapter.configuration );
        }

        this.init = function(){
            _addEventListeners();

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
        };
        
        this.run = function(){

            
            
            widget.start();

        }
        
        function _addEventListeners(){
            
            // Handle hash change
            // Needed to fire widget important events
            window.addEventListener('hash-received', function (e) {

                //console.log('New hash received ', window.location.hash);

                // Received hash is an stringified object
                // #(obj)
                var hash = window.location.hash.substring(1);
                var hashObject = JSON.parse( decodeURIComponent(hash));

                // Fire event refresh when signal received
                if( hashObject.signal === SIGNALS.REFRESH  ){
                    Utils.resetSignal();

                    WidgetAdapter.signal = hashObject.signal;
                    try{
                        widget.refresh();
                    }
                    catch(err){
                        Utils.handleError( new Error('Please add a method (refresh) to your widget!') );
                    }
                }

                // Fire event refresh when signal received
                if( hashObject.signal === SIGNALS.STOP  ){
                    Utils.resetSignal();
                    WidgetAdapter.signal = hashObject.signal;
                    try{
                        widget.stop();
                    }
                    catch(err){
                        Utils.handleError( new Error('Please add a method (refresh) to your widget!') );
                    }
                }

                if( hashObject.signal === SIGNALS.START  ){
                    Utils.resetSignal();
                    WidgetAdapter.signal = hashObject.signal;
                    try{
                        widget.start();
                    }
                    catch(err){
                        Utils.handleError( new Error('Please add a method (refresh) to your widget!') );
                    }
                }
            }, false);
        }

        function _loadWidgetConfiguration(){
            // ===============
            // Some init
            // widgetConfiguration is an object that can be create by widget creator to
            // overwrite some settings
            // ===============
            if( typeof window.widgetConfiguration !== 'undefined' ){
                Utils.log.debug('Substitute configuration provided by user. Use it instead of default library configuration!');
                if( window.widgetConfiguration.widget && window.widgetConfiguration.widget.configuration){
                    testWidgetProvided = window.widgetConfiguration.widget;
                }
                if( window.widgetConfiguration.log ){
                    LOG_LVL = window.widgetConfiguration.log;
                }
            }
            else{
                Utils.log.debug('No substitute configuration provided by user. Use default library configuration!');
            }
            // ===============
            // STEP 1
            // ===============
            // Get eventual settings from application
            // The first run a settings object may be passed by application
            var tmp = Utils.getUrlVars();

            // Get and build widget configuration into adapter
            if( testWidgetProvided ){
                return testWidgetProvided.configuration;
            }
            else{
                if( !tmp.widget){
                    throw new WidgetError("No widget configuration specified into URL");
                }
                if( ! Utils.checkValidityOfJsonFromUrl( tmp.widget )){
                    throw new WidgetError("Please specify a valid widget configuration");
                }
                return JSON.parse(tmp.widget);
            }
        }
    };

    Module.init();

    Module.run()

}).call(this);