var test = function(){

};
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

        convertUnixTsToDate: function( unixTS ){
            // create a new javascript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds
            var date = new Date(unixTS*1000);
            return date;
        }

    }.init();

    var Module = new function(){

        // Handle hash change
        // Needed to fire widget important events
        document.addEventListener('widget.hash.received', onHashReceived, false);
        
        this.init = function(){

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
            var configuration = _loadWidgetConfiguration();
            document.dispatchEvent(
                new CustomEvent('widget.init', {detail: configuration })
            );
        };
        
        this.run = function(){
            
            // Dispatch event to tell widget to run
            document.dispatchEvent( 
                new Event('widget.start')
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
                Utils.resetSignal();
                document.dispatchEvent(
                    new Event('widget.refresh')
                );
            }

            // Fire event refresh when signal received
            if( hashObject.signal === SIGNALS.STOP  ){
                Utils.resetSignal();
                document.dispatchEvent(
                    new Event('widget.stop')
                );
            }

            if( hashObject.signal === SIGNALS.START  ){
                Utils.resetSignal();
                document.dispatchEvent(
                    new Event('widget.start')
                );
            }
        }
        
        function _loadWidgetConfiguration(){
            // Define if the user provide a widget conf for testing (instead of URL)
            var testWidgetProvided = null;
            // ===============
            // Some init
            // widgetConfiguration is an object that can be create by widget creator to
            // overwrite some settings
            // ===============
            if( typeof window.widgetConfiguration !== 'undefined' ){
                //console.log('Substitute configuration provided by user. Use it instead of default library configuration!');
                if( window.widgetConfiguration.widget && window.widgetConfiguration.widget.configuration){
                    testWidgetProvided = window.widgetConfiguration.widget;
                }
            }
            else{
                console.log('No substitute configuration provided by user. Use default library configuration!');
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
                    throw new Error("No widget configuration specified into URL");
                }
                if( ! Utils.checkValidityOfJsonFromUrl( tmp.widget )){
                    throw new Error("Please specify a valid widget configuration");
                }
                return JSON.parse(tmp.widget);
            }
        }
    };

    // Init module
    Module.init();

    // Run module
    Module.run()

}).call(this);